import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import type { TideInfoResponse } from "@/lib/forecast-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TideTimelineChartProps {
  tideData: TideInfoResponse;
}

export function TideTimelineChart({ tideData }: TideTimelineChartProps) {
  const { extremesPoints } = tideData;

  // Sort tide points by time
  const sortedPoints = [...extremesPoints].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  // Prepare chart data
  const labels = sortedPoints.map((point) => {
    const date = new Date(point.time);
    return format(date, "h:mm a");
  });

  const heights = sortedPoints.map((point) => point.height);
  const types = sortedPoints.map((point) => point.type);

  // Calculate min and max for better scaling
  const minHeight = Math.min(...heights);
  const maxHeight = Math.max(...heights);
  const padding = (maxHeight - minHeight) * 0.1;

  const data = {
    labels,
    datasets: [
      {
        label: "Tide Height (m)",
        data: heights,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: types.map((type) =>
          type === "high" ? "rgb(59, 130, 246)" : "rgb(251, 146, 60)"
        ),
        pointBorderColor: types.map((type) =>
          type === "high" ? "rgb(30, 64, 175)" : "rgb(194, 65, 12)"
        ),
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const point = sortedPoints[index];
            const type = point.type === "high" ? "High" : "Low";
            const date = new Date(point.time);
            return [
              `${type} Tide: ${point.height.toFixed(2)}m`,
              `Time: ${format(date, "h:mm a")}`,
              `Date: ${format(date, "MMM d, yyyy")}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        min: minHeight - padding,
        max: maxHeight + padding,
        ticks: {
          callback: (value) => `${Number(value).toFixed(1)}m`,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  };

  // Group points by date for display
  const pointsByDate = sortedPoints.reduce((acc, point) => {
    const date = format(new Date(point.time), "MMM d, yyyy");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(point);
    return acc;
  }, {} as Record<string, typeof sortedPoints>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tide Timeline</CardTitle>
        <p className="text-muted-foreground text-sm">
          Next 24-48 hours tide predictions
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <Line data={data} options={options} />
        </div>
        
        {/* Tide Schedule */}
        <div className="mt-6 space-y-3">
          {Object.entries(pointsByDate).slice(0, 2).map(([date, points]) => (
            <div key={date} className="rounded-lg border p-3">
              <p className="font-medium text-sm mb-2">{date}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {points.map((point, idx) => {
                  const isHigh = point.type === "high";
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between rounded-md p-2 ${
                        isHigh
                          ? "bg-blue-50 dark:bg-blue-950/20"
                          : "bg-orange-50 dark:bg-orange-950/20"
                      }`}
                    >
                      <span className="text-sm">
                        {isHigh ? "↑ High" : "↓ Low"}
                      </span>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {format(new Date(point.time), "h:mm a")}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {point.height.toFixed(2)}m
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}