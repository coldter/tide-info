import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TideInfoResponse } from "@/lib/forecast-client";

function getPrevAndNext(
  points: TideInfoResponse["extremesPoints"]
): { prev: { time: Date; type: string } | null; next: { time: Date; type: string } | null } {
  const now = Date.now();
  let prev: { time: Date; type: string } | null = null;
  let next: { time: Date; type: string } | null = null;
  for (const p of points) {
    const t = new Date(p.time).getTime();
    if (t <= now) {
      prev = { time: new Date(t), type: p.type };
    } else if (!next) {
      next = { time: new Date(t), type: p.type };
    }
  }
  return { prev, next };
}

export function TideProgress({
  data,
  isPending,
}: {
  data: TideInfoResponse | undefined;
  isPending: boolean;
}) {
  if (isPending) return <Skeleton className="h-32 w-full" />;
  if (!data?.extremesPoints?.length) return null;

  const { prev, next } = getPrevAndNext(data.extremesPoints);
  if (!prev || !next) return null;

  const total = next.time.getTime() - prev.time.getTime();
  const elapsed = Date.now() - prev.time.getTime();
  const pct = Math.max(0, Math.min(100, (elapsed / total) * 100));

  const label = prev.type === "low" && next.type === "high" ? "Rising" : "Falling";

  return (
    <Card className="bg-card p-4">
      <h3 className="mb-2 font-semibold text-foreground">Tide Progress</h3>
      <p className="mb-3 text-muted-foreground text-xs">{label} tide cycle</p>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-[width] duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {prev.type} • {prev.time.toLocaleTimeString()}
        </span>
        <span className="text-muted-foreground">
          {next.type} • {next.time.toLocaleTimeString()}
        </span>
      </div>
    </Card>
  );
}

