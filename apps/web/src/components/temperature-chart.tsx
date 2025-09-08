import { Card } from "@/components/ui/card";

export function TemperatureChart() {
  const bars = [
    { height: "60%", color: "bg-purple-500", value: "24" },
    { height: "80%", color: "bg-green-500", value: "25" },
    { height: "70%", color: "bg-yellow-500", value: "25" },
    { height: "50%", color: "bg-orange-500", value: "" },
    { height: "90%", color: "bg-blue-500", value: "" },
  ];

  const locations = [
    { name: "Chek Lap Kok", color: "bg-purple-500" },
    { name: "Kai Tak Runway park", color: "bg-green-500" },
    { name: "Sai kung", color: "bg-blue-400" },
    { name: "Stanley", color: "bg-yellow-500" },
  ];

  return (
    <Card className="bg-card p-4">
      <h3 className="mb-4 font-semibold text-foreground">
        Current Temperature Chart
      </h3>
      <div className="mb-4 flex h-24 items-end gap-2">
        {bars.map((bar, index) => (
          <div
            className="flex flex-1 flex-col items-center"
            key={`temp-bar-${bar.height}-${bar.color}`}
          >
            <span className="sr-only">
              {`Temperature bar ${index + 1}: ${bar.value || "No data"}`}
            </span>
            <span className="mb-1 text-foreground text-xs">{bar.value}</span>
            <div
              className={`w-full ${bar.color} rounded-t`}
              style={{ height: bar.height }}
            />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {locations.map((location) => (
          <div className="flex items-center gap-2" key={location.name}>
            <div className={`h-3 w-3 rounded-full ${location.color}`} />
            <span className="text-muted-foreground text-sm">
              {location.name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
