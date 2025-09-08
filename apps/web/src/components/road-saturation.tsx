import { Card } from "@/components/ui/card";

export function RoadSaturation() {
  const districts = [
    { name: "Kowloon", level: 80, color: "bg-purple-500" },
    { name: "Tsuen Mun", level: 60, color: "bg-blue-500" },
    { name: "Sha Tin", level: 40, color: "bg-purple-400" },
    { name: "Hongkong", level: 90, color: "bg-purple-600" },
  ];

  return (
    <Card className="bg-card p-4">
      <h4 className="mb-3 font-medium text-foreground">
        Road Saturation Level by Districts
      </h4>
      <div className="space-y-2">
        {districts.map((district) => (
          <div className="flex items-center gap-2" key={district.name}>
            <span className="sr-only">
              {`${district.name}: ${district.level}% saturation`}
            </span>
            <span className="w-16 text-muted-foreground text-xs">
              {district.name}
            </span>
            <div className="h-2 flex-1 rounded-full bg-muted">
              <div
                className={`h-full ${district.color} rounded-full`}
                style={{ width: `${district.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
