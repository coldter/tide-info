import { Card } from "@/components/ui/card";

interface ConcentrationChartProps {
  title: string;
  color: "orange" | "blue" | "yellow" | "purple";
}

export function ConcentrationChart({ title, color }: ConcentrationChartProps) {
  const colorMap = {
    orange: "#f97316",
    blue: "#3b82f6",
    yellow: "#eab308",
    purple: "#a855f7",
  };

  return (
    <Card className="bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium text-foreground">{title}</h4>
        <span className="text-muted-foreground text-xs">Last update: Now</span>
      </div>
      <div className="flex h-16 items-end">
        <svg
          aria-label={`${title} concentration chart`}
          className="h-full w-full"
          role="img"
          viewBox="0 0 200 40"
        >
          <path
            d="M0,30 Q50,10 100,20 T200,15"
            fill="none"
            stroke={colorMap[color]}
            strokeWidth="2"
          />
        </svg>
      </div>
    </Card>
  );
}
