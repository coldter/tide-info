import { Cloud, Droplets, Eye, Thermometer, Waves, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TideInfoResponse } from "@/lib/forecast-client";

interface WeatherInfoCardProps {
  tideData: TideInfoResponse;
}

export function WeatherInfoCard({ tideData }: WeatherInfoCardProps) {
  const weather = tideData.stationWeather.hours;

  // Get average values from different sources
  const avgTemp = (weather.airTemperature.noaa + weather.airTemperature.sg) / 2;
  const avgWaterTemp =
    (weather.waterTemperature.noaa + weather.waterTemperature.sg) / 2;
  const avgWindSpeed = (weather.windSpeed.noaa + weather.windSpeed.sg) / 2;
  const avgWaveHeight = (weather.waveHeight.noaa + weather.waveHeight.sg) / 2;
  const humidity = weather.humidity.sg;
  const cloudCover = weather.cloudCover.sg;
  const visibility = weather.visibility.sg;
  const precipitation = weather.precipitation.sg;

  const weatherItems = [
    {
      icon: Thermometer,
      label: "Air Temp",
      value: `${avgTemp.toFixed(1)}°C`,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: Thermometer,
      label: "Water Temp",
      value: `${avgWaterTemp.toFixed(1)}°C`,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: `${avgWindSpeed.toFixed(1)} m/s`,
      color: "text-gray-600 dark:text-gray-400",
    },
    {
      icon: Waves,
      label: "Wave Height",
      value: `${avgWaveHeight.toFixed(1)}m`,
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${humidity.toFixed(0)}%`,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Cloud,
      label: "Cloud Cover",
      value: `${cloudCover.toFixed(0)}%`,
      color: "text-gray-600 dark:text-gray-400",
    },
    {
      icon: Eye,
      label: "Visibility",
      value: `${(visibility / 1000).toFixed(1)} km`,
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Droplets,
      label: "Precipitation",
      value: `${precipitation.toFixed(1)} mm/h`,
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Weather Conditions</CardTitle>
        <p className="text-muted-foreground text-sm">
          At the nearest coastal station
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {weatherItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                className="flex flex-col items-center space-y-2 rounded-lg border p-3"
                key={item.label}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
                <p className="text-center text-muted-foreground text-xs">
                  {item.label}
                </p>
                <p className="font-semibold text-lg">{item.value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
