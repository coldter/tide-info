import { Card } from "@/components/ui/card";

export function TrafficSpeedGauge() {
  return (
    <Card className="bg-card p-4">
      <h4 className="mb-3 font-medium text-foreground">
        Average Traffic Speed
      </h4>
      <div className="relative mx-auto h-20 w-20">
        <svg
          aria-label="Traffic speed gauge showing 25 km/h"
          className="-rotate-90 h-full w-full transform"
          role="img"
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            fill="none"
            r="30"
            stroke="rgb(75 85 99)"
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            fill="none"
            r="30"
            stroke="rgb(239 68 68)"
            strokeDasharray="60 120"
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-foreground text-xs">25 km/h</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-muted-foreground text-xs">Last update: Now</span>
      </div>
    </Card>
  );
}
