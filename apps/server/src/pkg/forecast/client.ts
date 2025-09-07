import { addDays, format } from "date-fns";
import {
  OPEN_WEATHER_SEARCH_URL,
  STORMGLASS_TIDE_EXTREMES_POINT_URL,
} from "@/pkg/forecast/const";
import type { SearchLocationResponse } from "@/pkg/forecast/types";
import type { KeyPoolClient } from "@/pkg/key-pooler/client";

export class ForecastClient {
  private readonly _stormglassClient: KeyPoolClient;
  private readonly _openWeatherMapClient: KeyPoolClient;

  constructor({
    stormglassClient,
    openWeatherMapClient,
  }: {
    stormglassClient: KeyPoolClient;
    openWeatherMapClient: KeyPoolClient;
  }) {
    this._stormglassClient = stormglassClient;
    this._openWeatherMapClient = openWeatherMapClient;
  }

  async searchLocation(query: string) {
    const url = `${OPEN_WEATHER_SEARCH_URL}?q=${query}&limit=5`;
    return await this._openWeatherMapClient.request(async (key) => {
      const response = await fetch(`${url}&appid=${key}`);

      const data = await response.json();

      if (Array.isArray(data)) {
        return (data as SearchLocationResponse[]).map((item) => ({
          name: item.name,
          lat: item.lat,
          lng: item.lon,
          country: item.country,
          state: item.state,
        }));
      }

      return [];
    });
  }

  async getTideExtremesPoints({ lat, lng }: { lat: number; lng: number }) {
    return await this._stormglassClient.request(async (key) => {
      const oneDayFromNow = addDays(new Date(), 1);
      const response = await fetch(
        `${STORMGLASS_TIDE_EXTREMES_POINT_URL}?lat=${lat}&lng=${lng}&end=${format(oneDayFromNow, "yyyy-MM-dd")}`,
        {
          headers: {
            Authorization: key,
          },
        }
      );
      const data = await response.json();
      return data;
    });
  }
}
