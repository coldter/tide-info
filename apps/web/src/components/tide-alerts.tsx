import { format } from "date-fns";
import { AlertTriangle, Bell, BellOff, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { TideInfoResponse } from "@/lib/forecast-client";

const ALERTS_KEY = "tide-info:alerts" as const;

interface AlertSettings {
  enabled: boolean;
  highTide: boolean;
  lowTide: boolean;
  minutesBefore: number;
  soundEnabled: boolean;
}

function getAlertSettings(): AlertSettings {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          enabled: false,
          highTide: true,
          lowTide: true,
          minutesBefore: 30,
          soundEnabled: true,
        };
  } catch {
    return {
      enabled: false,
      highTide: true,
      lowTide: true,
      minutesBefore: 30,
      soundEnabled: true,
    };
  }
}

function saveAlertSettings(settings: AlertSettings): void {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(settings));
}

interface TideAlertsProps {
  tideData?: TideInfoResponse;
}

export function TideAlerts({ tideData }: TideAlertsProps) {
  const [settings, setSettings] = useState(getAlertSettings);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [nextAlert, setNextAlert] = useState<{
    time: Date;
    type: "high" | "low";
    tideTime: Date;
  } | null>(null);

  // Check notification permission
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Calculate next alert time
  useEffect(() => {
    if (!(tideData && settings.enabled)) {
      setNextAlert(null);
      return;
    }

    const now = new Date();
    const upcomingTides: Array<{
      time: Date;
      type: "high" | "low";
      tideTime: Date;
    }> = [];

    if (settings.highTide && tideData.nextTides.nextHighTide) {
      const tideTime = new Date(tideData.nextTides.nextHighTide.time);
      const alertTime = new Date(
        tideTime.getTime() - settings.minutesBefore * 60_000
      );
      if (alertTime > now) {
        upcomingTides.push({
          time: alertTime,
          type: "high" as const,
          tideTime,
        });
      }
    }

    if (settings.lowTide && tideData.nextTides.nextLowTide) {
      const tideTime = new Date(tideData.nextTides.nextLowTide.time);
      const alertTime = new Date(
        tideTime.getTime() - settings.minutesBefore * 60_000
      );
      if (alertTime > now) {
        upcomingTides.push({ time: alertTime, type: "low" as const, tideTime });
      }
    }

    upcomingTides.sort((a, b) => a.time.getTime() - b.time.getTime());
    setNextAlert(upcomingTides[0] || null);
  }, [tideData, settings]);

  // Set up alert timer
  useEffect(() => {
    if (!(nextAlert && settings.enabled) || permission !== "granted") {
      return;
    }

    const checkAlert = () => {
      const now = new Date();
      if (now >= nextAlert.time) {
        const tideType = nextAlert.type === "high" ? "High" : "Low";
        const tideTimeStr = format(nextAlert.tideTime, "h:mm a");

        // Show notification
        new Notification(`${tideType} Tide Alert`, {
          body: `${tideType} tide coming at ${tideTimeStr} (in ${settings.minutesBefore} minutes)`,
          icon: "/favicon.ico",
          tag: "tide-alert",
        });

        // Play sound if enabled
        if (settings.soundEnabled) {
          const audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE"
          );
          audio.play().catch(() => {});
        }

        // Show toast
        toast.success(`${tideType} tide alert!`, {
          description: `${tideType} tide at ${tideTimeStr}`,
          duration: 10_000,
        });
      }
    };

    const interval = setInterval(checkAlert, 30_000); // Check every 30 seconds
    checkAlert(); // Check immediately

    return () => clearInterval(interval);
  }, [nextAlert, settings, permission]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications not supported in this browser");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        toast.success("Notifications enabled");
      } else {
        toast.error("Notification permission denied");
      }
    } catch (_error) {
      toast.error("Failed to request notification permission");
    }
  };

  const updateSettings = (updates: Partial<AlertSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    saveAlertSettings(newSettings);
  };

  const timeOptions = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Tide Alerts
          </CardTitle>
          {settings.enabled ? (
            <Badge className="bg-green-500" variant="default">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        {permission !== "granted" && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div className="flex-1">
                <p className="font-medium text-sm">Enable Notifications</p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Allow notifications to receive tide alerts
                </p>
                <Button
                  className="mt-2"
                  onClick={requestPermission}
                  size="sm"
                  variant="outline"
                >
                  Enable Notifications
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Alert Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer" htmlFor="alerts-enabled">
              Enable Tide Alerts
            </Label>
            <Checkbox
              checked={settings.enabled}
              disabled={permission !== "granted"}
              id="alerts-enabled"
              onCheckedChange={(checked) =>
                updateSettings({ enabled: checked as boolean })
              }
            />
          </div>

          {settings.enabled && (
            <>
              <div className="space-y-2 rounded-lg border p-3">
                <p className="font-medium text-sm">Alert Types</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      className="cursor-pointer text-sm"
                      htmlFor="high-tide"
                    >
                      High Tide
                    </Label>
                    <Checkbox
                      checked={settings.highTide}
                      id="high-tide"
                      onCheckedChange={(checked) =>
                        updateSettings({ highTide: checked as boolean })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      className="cursor-pointer text-sm"
                      htmlFor="low-tide"
                    >
                      Low Tide
                    </Label>
                    <Checkbox
                      checked={settings.lowTide}
                      id="low-tide"
                      onCheckedChange={(checked) =>
                        updateSettings({ lowTide: checked as boolean })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border p-3">
                <p className="font-medium text-sm">Alert Timing</p>
                <div className="grid grid-cols-2 gap-2">
                  {timeOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() =>
                        updateSettings({ minutesBefore: option.value })
                      }
                      size="sm"
                      variant={
                        settings.minutesBefore === option.value
                          ? "default"
                          : "outline"
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="cursor-pointer" htmlFor="sound-enabled">
                  Play Sound
                </Label>
                <Checkbox
                  checked={settings.soundEnabled}
                  id="sound-enabled"
                  onCheckedChange={(checked) =>
                    updateSettings({ soundEnabled: checked as boolean })
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* Next Alert Info */}
        {settings.enabled && nextAlert && (
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Next Alert:</span>
              <span className="font-medium">
                {format(nextAlert.time, "h:mm a")}
              </span>
              <Badge className="text-xs" variant="outline">
                {nextAlert.type === "high" ? "High" : "Low"} Tide
              </Badge>
            </div>
          </div>
        )}

        {/* Test Alert Button */}
        {settings.enabled && permission === "granted" && (
          <Button
            className="w-full"
            onClick={() => {
              new Notification("Test Tide Alert", {
                body: "This is a test notification for tide alerts",
                icon: "/favicon.ico",
              });
              if (settings.soundEnabled) {
                const audio = new Audio(
                  "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE"
                );
                audio.play().catch(() => {});
              }
              toast.success("Test alert sent!");
            }}
            size="sm"
            variant="outline"
          >
            <BellOff className="mr-2 h-4 w-4" />
            Send Test Alert
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
