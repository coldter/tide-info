import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function AirQualityCard() {
  return (
    <Card className="bg-card p-4">
      <h3 className="mb-4 font-semibold text-foreground">
        Air Quality Health Index
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            General Monitoring Station
          </span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-20 rounded bg-green-500" />
            <Badge
              className="bg-green-500/20 text-green-900 dark:text-green-100"
              variant="secondary"
            >
              Low
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Roadside Monitoring Station
          </span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 rounded bg-yellow-500" />
            <Badge
              className="bg-yellow-500/20 text-yellow-900 dark:text-black"
              variant="secondary"
            >
              High
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
