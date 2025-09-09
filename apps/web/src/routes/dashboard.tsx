import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { CoastMap } from "@/components/coast-map";
import { FavoriteLocations } from "@/components/favorite-locations";
import { RequireAuth } from "@/components/require-auth";
import { TideAlerts } from "@/components/tide-alerts";
import { TideCountdown } from "@/components/tide-countdown";
import { TideInfoCard } from "@/components/tide-info-card";
import { TideTimelineChart } from "@/components/tide-timeline-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherInfoCard } from "@/components/weather-info-card";
import { getTideInfo, reverseSearchLocation } from "@/lib/forecast-client";
import {
  clearStoredLocation,
  getBrowserLocation,
  readStoredLocation,
  type StoredLocation,
  writeStoredLocation,
} from "@/lib/location-client";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAuth>
      <div className="container mx-auto space-y-6 p-4 md:p-6">
        <DashboardContent />
      </div>
    </RequireAuth>
  );
}

function DashboardContent() {
  const queryClient = useQueryClient();

  // Fetch location data
  const locationQuery = useQuery({
    queryKey: ["location"],
    queryFn: async () => {
      const storedNow = readStoredLocation();
      if (storedNow) {
        return storedNow;
      }
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

  // Fetch tide data
  const tideQuery = useQuery({
    queryKey: ["tide", locationQuery.data?.lat, locationQuery.data?.lng],
    enabled: Boolean(locationQuery.data?.lat && locationQuery.data?.lng),
    queryFn: async () => {
      const { lat, lng } = locationQuery.data as StoredLocation;
      return await getTideInfo({ lat, lng });
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Re-detect location mutation
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
    onSuccess: (loc) => {
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

  // Clear location mutation
  const clearLocationMutation = useMutation({
    mutationFn: async () => {
      clearStoredLocation();
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location"] });
      queryClient.invalidateQueries({ queryKey: ["tide"] });
      toast.success("Location cleared");
    },
  });

  const handleLocationSelect = (location: StoredLocation) => {
    queryClient.setQueryData(["location"], location);
    queryClient.invalidateQueries({ queryKey: ["tide"] });
  };

  const locationName = locationQuery.data
    ? [
        locationQuery.data.name,
        locationQuery.data.state,
        locationQuery.data.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  let locationInfo: ReactNode;
  if (locationQuery.isPending) {
    locationInfo = <Skeleton className="h-5 w-48" />;
  } else if (locationQuery.isError) {
    locationInfo = (
      <p className="text-red-600 text-sm dark:text-red-400">
        Failed to get location
      </p>
    );
  } else {
    locationInfo = (
      <>
        <p className="font-medium text-sm">{locationName}</p>
        <p className="text-muted-foreground text-xs">
          {locationQuery.data?.lat.toFixed(4)},{" "}
          {locationQuery.data?.lng.toFixed(4)}
        </p>
      </>
    );
  }

  let mainContent: ReactNode = null;
  if (locationQuery.isError) {
    mainContent = (
      <Card className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">
          Failed to get location. Please enable location services and try again.
        </p>
        <Button
          className="mt-4"
          onClick={() => locationQuery.refetch()}
          variant="outline"
        >
          Retry
        </Button>
      </Card>
    );
  } else if (tideQuery.isPending) {
    mainContent = (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  } else if (tideQuery.isError) {
    mainContent = (
      <Card className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">
          Failed to load tide information. Please try again.
        </p>
        <Button
          className="mt-4"
          onClick={() => tideQuery.refetch()}
          variant="outline"
        >
          Retry
        </Button>
      </Card>
    );
  } else if (tideQuery.data) {
    mainContent = (
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tide Information Card */}
          <TideInfoCard locationName={locationName} tideData={tideQuery.data} />

          {/* Countdown Timer */}
          <TideCountdown
            height={tideQuery.data.nextTides.nextTide.height}
            targetTime={tideQuery.data.nextTides.nextTide.time}
            tideType={
              tideQuery.data.nextTides.nextTide.type === "high" ? "high" : "low"
            }
          />

          {/* Tide Timeline Chart */}
          <TideTimelineChart tideData={tideQuery.data} />

          {/* Weather Information */}
          <WeatherInfoCard tideData={tideQuery.data} />

          {/* Map */}
          <CoastMap
            locationName={locationName}
            tideData={tideQuery.data}
            userLocation={locationQuery.data}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tide Alerts */}
          <TideAlerts tideData={tideQuery.data} />

          {/* Favorite Locations */}
          <FavoriteLocations onLocationSelect={handleLocationSelect} />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              Tide Information
            </h1>
            <p className="text-muted-foreground">
              Real-time tide predictions and coastal weather
            </p>
          </div>
        </div>

        {/* Location Bar */}
        <Card className="bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>{locationInfo}</div>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={locationQuery.isPending || redetectMutation.isPending}
                onClick={() => redetectMutation.mutate()}
                size="sm"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {redetectMutation.isPending
                  ? "Detecting..."
                  : "Use Current Location"}
              </Button>
              {locationQuery.data && (
                <Button
                  onClick={() => clearLocationMutation.mutate()}
                  size="sm"
                  variant="ghost"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      {mainContent}
    </>
  );
}
