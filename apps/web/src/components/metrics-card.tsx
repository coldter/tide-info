import { ArrowUpRight } from "lucide-react";
import type React from "react"; // Added import for React
import { Card } from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    percentage: string;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
}

export function MetricsCard({ title, value, change, chart }: MetricsCardProps) {
  return (
    <Card className="bg-background/50 p-4 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm">{title}</h3>
        {chart ? (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        ) : null}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-bold text-2xl">{value}</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-sm">
              {change.isPositive ? "+" : ""}
              {change.value}
            </span>
            <span
              className={`text-sm ${change.isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {change.percentage}
            </span>
          </div>
        </div>
        {chart}
      </div>
    </Card>
  );
}
