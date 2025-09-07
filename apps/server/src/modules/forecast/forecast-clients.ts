import { ms } from "itty-time";
import { ForecastClient } from "@/pkg/forecast/client";
import { KeyPoolClient } from "@/pkg/key-pooler/client";
import { KeyPoolStore } from "@/pkg/key-pooler/key-pool-store";
import { createCachedStorage } from "@/pkg/storage";

/**
 * Open Weather Map
 */
const openWeatherMapKeyPoolStore = new KeyPoolStore(
  createCachedStorage("open-weather-map-key-pool", 0)
);
const openWeatherMapKeyPoolerClient = new KeyPoolClient(
  openWeatherMapKeyPoolStore,
  {
    maxRequestsPerKey: 1000,
    coolDownPeriodMs: ms("1 day"),
  }
);

await openWeatherMapKeyPoolerClient.initialize(
  process.env.OPEN_WEATHER_MAP_API_KEY
    ? process.env.OPEN_WEATHER_MAP_API_KEY.split(",")
        .filter(Boolean)
        .map((key) => key.trim())
    : []
);

/**
 * Stormglass
 */
const stormglassKeyPoolStore = new KeyPoolStore(
  createCachedStorage("stormglass-key-pool", 0)
);
const stormglassKeyPoolerClient = new KeyPoolClient(stormglassKeyPoolStore, {
  maxRequestsPerKey: 10,
  coolDownPeriodMs: ms("1 day"),
});

await stormglassKeyPoolerClient.initialize(
  process.env.STORM_GLASS_API_KEY
    ? process.env.STORM_GLASS_API_KEY.split(",")
        .filter(Boolean)
        .map((key) => key.trim())
    : []
);

/**
 * Forecast Client
 */
export const forecastClient = new ForecastClient({
  openWeatherMapClient: openWeatherMapKeyPoolerClient,
  stormglassClient: stormglassKeyPoolerClient,
});
