import { Card } from "@/components/ui/card";

export function CarParkVacancy() {
  const vacancyData = [60, 40, 80, 30, 90, 20];

  return (
    <Card className="bg-card p-4">
      <h4 className="mb-4 font-medium text-foreground">
        Car Park Vacancy for private car
      </h4>
      <div className="flex h-20 items-end justify-between">
        {vacancyData.map((height, index) => (
          <div className="flex flex-col items-center" key={`vacancy-${height}`}>
            <span className="sr-only">
              {`Parking spot ${index + 1}: ${height}% occupied`}
            </span>
            <div
              className="mb-1 w-4 rounded-t bg-blue-500"
              style={{ height: `${height}%` }}
            />
            <div className="h-2 w-2 rounded-full bg-blue-400" />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-muted-foreground text-xs">
        <div className="text-center">Lorem</div>
        <div className="text-center">Lorem</div>
        <div className="text-center">Lorem</div>
      </div>
    </Card>
  );
}
