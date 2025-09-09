import { differenceInMinutes, format } from "date-fns";
import { ArrowDown, ArrowUp, Clock, MapPin, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TideInfoResponse } from "@/lib/forecast-client";
import { cn } from "@/lib/utils";

interface TideInfoCardProps {
  tideData: TideInfoResponse;
  locationName?: string;
}

export function TideInfoCard({ tideData, locationName }: TideInfoCardProps) {
  const { nextTides, station } = tideData;
  const currentTime = new Date();

  const getTimeUntil = (timeString: string) => {
    const targetTime = new Date(timeString);
    const minutes = differenceInMinutes(targetTime, currentTime);

    if (minutes < 0) {
      return "Past";
    }
    if (minutes < 60) {
      return `${minutes}m`;
    }
    if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  };

  const formatTideTime = (timeString: string) => {
    const date = new Date(timeString);
    return format(date, "h:mm a");
  };

  const formatTideDate = (timeString: string) => {
    const date = new Date(timeString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return format(date, "MMM d");
  };

  const nextTide = nextTides.nextTide;
  const isHighTide = nextTide.type === "high";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Tide Information
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="h-3 w-3" />
              <span>{locationName || station.name}</span>
              {station.distance > 0 && (
                <Badge className="text-xs" variant="secondary">
                  {station.distance.toFixed(1)} km away
                </Badge>
              )}
            </div>
          </div>
          <Badge variant={isHighTide ? "default" : "secondary"}>
            {isHighTide ? "High Tide" : "Low Tide"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Time */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              <span>Current Time</span>
            </div>
            <span className="font-medium">{format(currentTime, "h:mm a")}</span>
          </div>
        </div>

        {/* Next Tide */}
        <div
          className={cn(
            "rounded-lg border-2 p-4",
            isHighTide
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isHighTide ? (
                  <ArrowUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ArrowDown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                )}
                <span className="font-semibold text-lg">
                  Next {isHighTide ? "High" : "Low"} Tide
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-2xl">
                  {formatTideTime(nextTide.time)}
                </p>
                <p className="text-muted-foreground text-sm">
                  {formatTideDate(nextTide.time)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="font-mono" variant="outline">
                  {nextTide.height.toFixed(2)}m
                </Badge>
                <Badge variant="secondary">
                  In {getTimeUntil(nextTide.time)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* High and Low Tide Times */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* High Tide */}
          <div className="rounded-lg border bg-blue-50 p-3 dark:bg-blue-950/20">
            <div className="mb-2 flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-sm">High Tide</span>
            </div>
            <p className="font-semibold text-xl">
              {formatTideTime(nextTides.nextHighTide.time)}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatTideDate(nextTides.nextHighTide.time)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Badge className="font-mono text-xs" variant="outline">
                {nextTides.nextHighTide.height.toFixed(2)}m
              </Badge>
              <span className="text-muted-foreground text-xs">
                {getTimeUntil(nextTides.nextHighTide.time)}
              </span>
            </div>
          </div>

          {/* Low Tide */}
          <div className="rounded-lg border bg-orange-50 p-3 dark:bg-orange-950/20">
            <div className="mb-2 flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="font-medium text-sm">Low Tide</span>
            </div>
            <p className="font-semibold text-xl">
              {formatTideTime(nextTides.nextLowTide.time)}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatTideDate(nextTides.nextLowTide.time)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Badge className="font-mono text-xs" variant="outline">
                {nextTides.nextLowTide.height.toFixed(2)}m
              </Badge>
              <span className="text-muted-foreground text-xs">
                {getTimeUntil(nextTides.nextLowTide.time)}
              </span>
            </div>
          </div>
        </div>

        {/* Station Info */}
        <div className="rounded-lg border bg-muted/20 p-3">
          <p className="text-muted-foreground text-xs">
            Tide data from: <span className="font-medium">{station.name}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
