import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TideInfoResponse } from "@/lib/forecast-client";

export function TideTimeline({
  data,
  isPending,
}: {
  data: TideInfoResponse | undefined;
  isPending: boolean;
}) {
  if (isPending) {
    return <Skeleton className="h-40 w-full" />;
  }
  if (!data?.extremesPoints?.length) {
    return null;
  }

  const points = data.extremesPoints
    .slice()
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  // Map to normalized x positions over the period
  const start = new Date(points[0].time).getTime();
  const end = new Date(points[points.length - 1].time).getTime();
  const range = Math.max(1, end - start);

  const width = 600;
  const height = 120;
  const padding = 16;
  const minY = Math.min(...points.map((p) => p.height));
  const maxY = Math.max(...points.map((p) => p.height));
  const yRange = Math.max(1, maxY - minY);

  const toX = (t: string) =>
    padding + ((new Date(t).getTime() - start) / range) * (width - padding * 2);
  const toY = (h: number) =>
    height - padding - ((h - minY) / yRange) * (height - padding * 2);

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.time)},${toY(p.height)}`)
    .join(" ");

  return (
    <Card className="bg-card p-4">
      <h3 className="mb-2 font-semibold text-foreground">Tide Timeline</h3>
      <p className="mb-2 text-muted-foreground text-xs">
        Next 24h extreme tide heights (m)
      </p>
      <div className="w-full overflow-x-auto">
        <svg
          aria-label="Tide extremes timeline"
          className="h-[140px] min-w-[640px] w-full"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
        >
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2" />
          {points.map((p) => (
            <circle
              key={`${p.time}-${p.height}`}
              cx={toX(p.time)}
              cy={toY(p.height)}
              r={3}
              fill={p.type === "high" ? "var(--color-chart-2)" : "var(--color-chart-5)"}
            />
          ))}
        </svg>
      </div>
    </Card>
  );
}

