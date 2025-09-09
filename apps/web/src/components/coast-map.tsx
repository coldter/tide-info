import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TideInfoResponse } from "@/lib/forecast-client";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface CoastMapProps {
  tideData: TideInfoResponse;
  userLocation?: { lat: number; lng: number };
  locationName?: string;
}

function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

export function CoastMap({ tideData, userLocation, locationName }: CoastMapProps) {
  const { station } = tideData;
  const mapCenter: [number, number] = [station.lat, station.lng];

  // Create custom icons
  const stationIcon = L.divIcon({
    html: `
      <div style="
        background: rgb(59, 130, 246);
        border: 2px solid white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const userIcon = L.divIcon({
    html: `
      <div style="
        background: rgb(34, 197, 94);
        border: 2px solid white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Coast Location</CardTitle>
        <p className="text-muted-foreground text-sm">
          {locationName ? `Near ${locationName}` : "Nearest tide station"}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] w-full">
          <MapContainer
            center={mapCenter}
            zoom={10}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <MapController center={mapCenter} zoom={10} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Tide Station Marker */}
            <Marker position={[station.lat, station.lng]} icon={stationIcon}>
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{station.name}</p>
                  <p className="text-sm">Tide Station</p>
                  <p className="text-muted-foreground text-xs">
                    Source: {station.source}
                  </p>
                  {station.distance > 0 && (
                    <p className="text-muted-foreground text-xs">
                      {station.distance.toFixed(1)} km from your location
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* User Location Marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>
                  <div className="space-y-1">
                    <p className="font-semibold">Your Location</p>
                    <p className="text-muted-foreground text-xs">
                      {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 border-t p-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Tide Station</span>
          </div>
          {userLocation && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Your Location</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}