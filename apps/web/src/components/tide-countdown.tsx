import { differenceInSeconds } from "date-fns";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TideCountdownProps {
  targetTime: string;
  tideType: "high" | "low";
  height: number;
}

export function TideCountdown({
  targetTime,
  tideType,
  height,
}: TideCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(targetTime);
      const totalSeconds = differenceInSeconds(target, now);

      if (totalSeconds <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds, total: totalSeconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const isUrgent = timeLeft.total > 0 && timeLeft.total < 3600; // Less than 1 hour

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        isUrgent && "ring-2 ring-orange-500 ring-offset-2"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Next Tide Countdown
          </CardTitle>
          <Badge
            className={cn(
              tideType === "high"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-orange-500 text-white hover:bg-orange-600"
            )}
            variant={tideType === "high" ? "default" : "secondary"}
          >
            {tideType === "high" ? "High" : "Low"} Tide
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {timeLeft.total > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div
                  className={cn(
                    "rounded-lg p-3",
                    tideType === "high"
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : "bg-orange-50 dark:bg-orange-950/20"
                  )}
                >
                  <p className="font-bold text-3xl tabular-nums">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </p>
                  <p className="text-muted-foreground text-xs uppercase">
                    Hours
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div
                  className={cn(
                    "rounded-lg p-3",
                    tideType === "high"
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : "bg-orange-50 dark:bg-orange-950/20"
                  )}
                >
                  <p className="font-bold text-3xl tabular-nums">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </p>
                  <p className="text-muted-foreground text-xs uppercase">
                    Minutes
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div
                  className={cn(
                    "rounded-lg p-3",
                    tideType === "high"
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : "bg-orange-50 dark:bg-orange-950/20"
                  )}
                >
                  <p className="font-bold text-3xl tabular-nums">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </p>
                  <p className="text-muted-foreground text-xs uppercase">
                    Seconds
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg border p-2">
              <span className="text-muted-foreground text-sm">Height</span>
              <Badge className="font-mono" variant="outline">
                {height.toFixed(2)}m
              </Badge>
            </div>

            {isUrgent && (
              <div className="mt-3 rounded-lg bg-orange-100 p-2 text-center dark:bg-orange-950/20">
                <p className="font-medium text-orange-800 text-sm dark:text-orange-200">
                  ⚠️ Less than 1 hour remaining!
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg bg-gray-100 py-8 text-center dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              Tide has already occurred
            </p>
            <p className="mt-2 text-muted-foreground text-sm">
              Please refresh for updated information
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
