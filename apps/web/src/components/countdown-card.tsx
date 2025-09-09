"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CountdownCardProps {
  targetDate: Date;
  title?: string;
  className?: string;
  variant?: "default" | "compact";
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function CountdownCard({
  targetDate,
  title = "Countdown",
  className,
  variant = "default",
}: CountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date();
      const target = new Date(targetDate);

      // Convert both dates to UTC for consistent timezone handling
      const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60_000);
      const targetUTC = new Date(
        target.getTime() + target.getTimezoneOffset() * 60_000
      );

      const difference = targetUTC.getTime() - nowUTC.getTime();

      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds, isExpired: false };
    };

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());

    // Set up interval to update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader>
        <CardTitle
          className={`text-center text-foreground ${
            variant === "compact" ? "text-base" : ""
          }`}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          {timeLeft.isExpired ? (
            <div className="font-bold text-3xl text-destructive">
              Time's up!
            </div>
          ) : (
            <div
              className={`flex items-center justify-center ${
                variant === "compact" ? "gap-6" : "gap-8"
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`font-bold font-mono text-foreground ${
                    variant === "compact" ? "text-5xl" : "text-6xl"
                  }`}
                >
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="mt-1 text-muted-foreground text-sm">hours</div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`font-bold font-mono text-foreground ${
                    variant === "compact" ? "text-5xl" : "text-6xl"
                  }`}
                >
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="mt-1 text-muted-foreground text-sm">min</div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`font-bold font-mono text-foreground ${
                    variant === "compact" ? "text-5xl" : "text-6xl"
                  }`}
                >
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="mt-1 text-muted-foreground text-sm">sec</div>
              </div>
            </div>
          )}
          {!timeLeft.isExpired && (
            <p
              className={`text-muted-foreground text-sm ${
                variant === "compact" ? "mt-3" : "mt-4"
              }`}
            >
              On {targetDate.toLocaleDateString()}{" "}
              {targetDate.toLocaleTimeString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
