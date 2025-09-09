import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

type TideMapProps = {
  lat?: number;
  lng?: number;
  title?: string;
  subtitle?: string;
};

export function MapSection({ lat, lng, title, subtitle }: TideMapProps) {
  return (
    <Card className="bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">
            {title ?? "Nearest tide station"}
          </h3>
          <p className="text-muted-foreground text-xs">
            {subtitle ?? "Station position relative to your location"}
          </p>
        </div>
        <MapPin aria-hidden className="h-5 w-5 text-primary" />
      </div>
      <div className="relative h-64 overflow-hidden rounded bg-muted">
        {/* Placeholder map area (we can swap to Leaflet later) */}
        <div
          aria-label="Station map placeholder"
          className="h-full w-full bg-center bg-cover"
          role="img"
          style={{
            backgroundImage: "url(/placeholder.svg?height=256&width=400)",
          }}
        >
          <span className="sr-only">Station map placeholder</span>
        </div>
        {typeof lat === "number" && typeof lng === "number" && (
          <div className="absolute right-3 bottom-3 rounded bg-card/80 p-2 text-xs">
            <span className="text-muted-foreground">Lat/Lng:</span>{" "}
            <span className="text-foreground">{lat.toFixed(4)}</span>,{" "}
            <span className="text-foreground">{lng.toFixed(4)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
