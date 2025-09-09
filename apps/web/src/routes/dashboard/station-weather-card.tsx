import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TideInfoResponse } from "@/lib/forecast-client";

function firstNumber(v?: Record<string, number>) {
  if (!v) return undefined;
  const values = Object.values(v).filter((n) => Number.isFinite(n));
  return values.length ? values[0] : undefined;
}

export function StationWeatherCard({
  data,
  isPending,
}: {
  data: TideInfoResponse | undefined;
  isPending: boolean;
}) {
  if (isPending) return <Skeleton className="h-32 w-full" />;
  if (!data?.stationWeather?.hours) return null;

  const h = data.stationWeather.hours;
  const air = firstNumber(h.airTemperature);
  const water = firstNumber(h.waterTemperature);
  const wind = firstNumber(h.windSpeed);
  const wave = firstNumber(h.waveHeight);

  return (
    <Card className="bg-card p-4">
      <h3 className="mb-3 font-semibold text-foreground">Station Conditions</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-border p-3">
          <p className="text-muted-foreground text-xs">Air Temp</p>
          <p className="font-semibold text-lg text-primary">
            {air !== undefined ? `${air.toFixed(1)}°C` : "—"}
          </p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-muted-foreground text-xs">Water Temp</p>
          <p className="font-semibold text-lg text-primary">
            {water !== undefined ? `${water.toFixed(1)}°C` : "—"}
          </p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-muted-foreground text-xs">Wind Speed</p>
          <p className="font-semibold text-lg text-primary">
            {wind !== undefined ? `${wind.toFixed(1)} m/s` : "—"}
          </p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="text-muted-foreground text-xs">Wave Height</p>
          <p className="font-semibold text-lg text-primary">
            {wave !== undefined ? `${wave.toFixed(2)} m` : "—"}
          </p>
        </div>
      </div>
    </Card>
  );
}

