import { Cloud, Minus, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MapSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="bg-card p-4">
          <div className="flex items-center gap-3">
            <div
              aria-label="ESRI China Hong Kong logo"
              className="h-8 w-20 bg-contain bg-left bg-no-repeat"
              role="img"
              style={{
                backgroundImage: "url(/placeholder.svg?height=40&width=80)",
              }}
            >
              <span className="sr-only">ESRI China Hong Kong logo</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Powered by</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-card p-4">
          <div className="flex items-center gap-3">
            <Cloud aria-hidden="true" className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Temperature</h3>
              <p className="font-bold text-2xl text-primary">19° C</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="relative bg-card p-4">
        <div className="relative h-64 overflow-hidden rounded bg-muted">
          <div
            aria-label="Interactive map of Hong Kong showing street network"
            className="h-full w-full bg-center bg-cover"
            role="img"
            style={{
              backgroundImage: "url(/placeholder.svg?height=256&width=400)",
            }}
          >
            <span className="sr-only">
              Interactive map of Hong Kong showing street network
            </span>
          </div>
          <div className="absolute right-4 bottom-4 flex flex-col gap-2">
            <button
              aria-label="Zoom in on map"
              className="flex h-8 w-8 items-center justify-center rounded bg-accent text-foreground hover:bg-muted"
              type="button"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              aria-label="Zoom out on map"
              className="flex h-8 w-8 items-center justify-center rounded bg-accent text-foreground hover:bg-muted"
              type="button"
            >
              <Minus aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
