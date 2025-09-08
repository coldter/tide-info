import { createFileRoute } from "@tanstack/react-router";
import { AirQualityCard } from "@/components/air-quality-card";
import { CarParkVacancy } from "@/components/car-park-vacancy";
import { ConcentrationChart } from "@/components/concentration-chart";
import { MapSection } from "@/components/map-section";
import { RequireAuth } from "@/components/require-auth";
import { RoadSaturation } from "@/components/road-saturation";
import { TemperatureChart } from "@/components/temperature-chart";
import { TrafficSpeedGauge } from "@/components/traffic-speed-gauge";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAuth>
      <div className="space-y-4 p-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-4">
            <AirQualityCard />
            <ConcentrationChart color="orange" title="NO₂ Concentration" />
            <ConcentrationChart color="blue" title="O₂ Concentration" />
            <ConcentrationChart color="yellow" title="PM2.5 Concentration" />
            <ConcentrationChart color="purple" title="PM10 Concentration" />
          </div>

          {/* Middle column */}
          <div className="space-y-4">
            <TemperatureChart />
            <MapSection />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <TrafficSpeedGauge />
            <RoadSaturation />
            <CarParkVacancy />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
