import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TideInfoResponse } from "@/lib/forecast-client";

export function TideSummaryCard({
  data,
  isPending,
}: {
  data: TideInfoResponse | undefined;
  isPending: boolean;
}) {
  if (isPending) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (!data) {
    return null;
  }

  const next = data.nextTides.nextTide;
  const high = data.nextTides.nextHighTide;
  const low = data.nextTides.nextLowTide;

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString();
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
  const timeUntil = (iso: string) => {
    const diffMs = new Date(iso).getTime() - Date.now();
    if (diffMs <= 0) return "now";
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <Card className="bg-card p-4">
      <h3 className="mb-2 font-semibold text-foreground">Upcoming Tides</h3>
      <p className="mb-4 text-muted-foreground text-xs">
        Times are shown in your local timezone
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border p-3">
          <p className="text-muted-foreground text-xs">Next tide</p>
          <p className="text-foreground text-sm">{next.type}</p>
          <p className="font-semibold text-lg text-primary">
            {formatTime(next.time)}
          </p>
          <p className="text-muted-foreground text-xs">{formatDate(next.time)}</p>
          <p className="text-muted-foreground text-xs">In {timeUntil(next.time)}</p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-muted-foreground text-xs">Next high tide</p>
          <p className="text-foreground text-sm">{high.height.toFixed(2)} m</p>
          <p className="font-semibold text-lg text-primary">
            {formatTime(high.time)}
          </p>
          <p className="text-muted-foreground text-xs">{formatDate(high.time)}</p>
          <p className="text-muted-foreground text-xs">In {timeUntil(high.time)}</p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-muted-foreground text-xs">Next low tide</p>
          <p className="text-foreground text-sm">{low.height.toFixed(2)} m</p>
          <p className="font-semibold text-lg text-primary">
            {formatTime(low.time)}
          </p>
          <p className="text-muted-foreground text-xs">{formatDate(low.time)}</p>
          <p className="text-muted-foreground text-xs">In {timeUntil(low.time)}</p>
        </div>
      </div>
    </Card>
  );
}

