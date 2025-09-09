import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { CountdownCard } from "@/components/countdown-card";
import { RequireAuth } from "@/components/require-auth";
import { MapSection } from "@/components/map-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTideInfo, reverseSearchLocation } from "@/lib/forecast-client";
import {
  getBrowserLocation,
  readStoredLocation,
  type StoredLocation,
  writeStoredLocation,
} from "@/lib/location-client";
import { TideSummaryCard } from "@/routes/dashboard/tide-summary-card";
import { TideTimeline } from "@/routes/dashboard/tide-timeline";
import { StationWeatherCard } from "@/routes/dashboard/station-weather-card";
import { TideProgress } from "@/routes/dashboard/tide-progress";
import { SearchLocation } from "@/routes/dashboard/search-location";
import { CurrentTimeCard } from "@/routes/dashboard/current-time-card";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAuth>
      <div className="space-y-4 p-4">
        <LocationGate />
        <DashboardTideContent />
      </div>
    </RequireAuth>
  );
}

type LocationTextState = {
  text: string;
  variant: "loading" | "error" | "normal";
};

function formatLocationText(
  data: StoredLocation | undefined,
  isPending: boolean,
  isError: boolean,
  error: unknown
): LocationTextState {
  if (isPending) {
    return { text: "", variant: "loading" };
  }
  if (isError) {
    const message =
      error instanceof Error ? error.message : "Failed to get location";
    return { text: message, variant: "error" };
  }
  if (data?.name) {
    const parts = [data.name];
    if (data.state) {
      parts.push(data.state);
    }
    if (data.country) {
      parts.push(data.country);
    }
    return { text: parts.join(", "), variant: "normal" };
  }
  if (data) {
    return {
      text: `${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`,
      variant: "normal",
    };
  }
  return { text: "", variant: "normal" };
}

function LocationGate() {
  const queryClient = useQueryClient();

  const locationQuery = useQuery({
    queryKey: ["location"],
    queryFn: async () => {
      const currentlyStored = readStoredLocation();
      if (currentlyStored) return currentlyStored;
      const coords = await getBrowserLocation();
      const reverse = await reverseSearchLocation(coords);
      const enriched: StoredLocation = {
        lat: reverse.lat,
        lng: reverse.lng,
        name: reverse.name,
        country: reverse.country,
        state: reverse.state,
        updatedAt: Date.now(),
      };
      writeStoredLocation(enriched);
      return enriched;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const tideQuery = useQuery({
    queryKey: ["tide", locationQuery.data?.lat, locationQuery.data?.lng],
    enabled: Boolean(locationQuery.data?.lat && locationQuery.data?.lng),
    queryFn: async () => {
      const { lat, lng } = locationQuery.data as StoredLocation;
      return await getTideInfo({ lat, lng });
    },
    staleTime: 5 * 60 * 1000,
  });

  const redetectMutation = useMutation({
    mutationFn: async () => {
      const coords = await getBrowserLocation();
      const reverse = await reverseSearchLocation(coords);
      const enriched: StoredLocation = {
        lat: reverse.lat,
        lng: reverse.lng,
        name: reverse.name,
        country: reverse.country,
        state: reverse.state,
        updatedAt: Date.now(),
      };
      writeStoredLocation(enriched);
      return enriched;
    },
    onSuccess: (loc: StoredLocation) => {
      queryClient.setQueryData(["location"], loc);
      queryClient.invalidateQueries({ queryKey: ["tide"] }).catch(() => {});
      toast.success("Location updated");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to get location";
      toast.error(message);
    },
  });

  const locText = formatLocationText(
    locationQuery.data,
    locationQuery.isPending,
    locationQuery.isError,
    locationQuery.error
  );

  let locationContent: ReactNode;
  if (locationQuery.isPending) {
    locationContent = <Skeleton className="mt-1 h-5 w-48" />;
  } else if (locText.variant === "error") {
    locationContent = (
      <p className="truncate text-red-600 text-sm dark:text-red-400">
        {locText.text}
      </p>
    );
  } else {
    locationContent = (
      <p className="truncate text-foreground text-sm">{locText.text}</p>
    );
  }

  return (
    <>
      <Card className="bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">Using location</p>
            {locationContent}
            {tideQuery.isPending && (
              <p className="text-muted-foreground text-xs">Loading tide info…</p>
            )}
            {tideQuery.isError && (
              <p className="text-red-600 text-xs dark:text-red-400">
                Failed to load tide info
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled={locationQuery.isPending || redetectMutation.isPending}
              onClick={() => redetectMutation.mutate()}
              size="sm"
              type="button"
              variant="outline"
            >
              {redetectMutation.isPending ? "Detecting…" : "Use current location"}
            </Button>
          </div>
        </div>
      </Card>

      <DashboardTide data={tideQuery.data} isPending={tideQuery.isPending} />
      <SearchLocation />
    </>
  );
}

function DashboardTide({
  data,
  isPending,
}: {
  data: Awaited<ReturnType<typeof getTideInfo>> | undefined;
  isPending: boolean;
}) {
  const stationTitle = data?.station?.name
    ? `${data.station.name} • ${data.station.distance.toFixed(0)} m`
    : undefined;
  const stationSubtitle = data?.station
    ? `${data.station.lat.toFixed(4)}, ${data.station.lng.toFixed(4)}`
    : undefined;

  const nextDates = useMemo(() => {
    if (!data?.nextTides) return null;
    return {
      next: new Date(data.nextTides.nextTide.time),
      high: new Date(data.nextTides.nextHighTide.time),
      low: new Date(data.nextTides.nextLowTide.time),
    };
  }, [data]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4">
        <TideSummaryCard data={data} isPending={isPending} />
        <TideProgress data={data} isPending={isPending} />
        <StationWeatherCard data={data} isPending={isPending} />
      </div>

      <div className="space-y-4">
        {nextDates && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CountdownCard className="h-full" targetDate={nextDates.high} title="Next High Tide" variant="compact" />
            <CountdownCard className="h-full" targetDate={nextDates.low} title="Next Low Tide" variant="compact" />
          </div>
        )}
        <TideTimeline data={data} isPending={isPending} />
        <MapSection lat={data?.station?.lat} lng={data?.station?.lng} title={stationTitle} subtitle={stationSubtitle} />
      </div>

      <div className="space-y-4">
        <CurrentTimeCard />
      </div>
    </div>
  );
}

function DashboardTideContent() {
  // placeholder to keep layout consistent if needed later
  return null;
}
