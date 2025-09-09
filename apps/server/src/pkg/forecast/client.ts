import { addDays, format } from "date-fns";
import {
  OPEN_WEATHER_REVERSE_SEARCH_URL,
  OPEN_WEATHER_SEARCH_URL,
  STORMGLASS_POINT_WEATHER_URL,
  STORMGLASS_TIDE_EXTREMES_POINT_URL,
} from "@/pkg/forecast/const";
import type {
  PointWeatherResponse,
  SearchLocationResponse,
  TideExtremesPointResponse,
} from "@/pkg/forecast/types";
import {
  type KeyPoolClient,
  RequestRateLimitError,
} from "@/pkg/key-pooler/client";

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
      if (!response.ok) {
        throw new RequestRateLimitError(
          `Request failed with status: ${response.statusText}`
        );
      }

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

  async reverseSearchLocation({ lat, lng }: { lat: number; lng: number }) {
    const url = `${OPEN_WEATHER_REVERSE_SEARCH_URL}?lat=${lat}&lon=${lng}&limit=1`;
    return await this._openWeatherMapClient.request(async (key) => {
      const response = await fetch(`${url}&appid=${key}`);
      if (!response.ok) {
        throw new RequestRateLimitError(
          `Request failed with status: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        const items = (data as SearchLocationResponse[]).map((item) => ({
          name: item.name,
          lat: item.lat,
          lng: item.lon,
          country: item.country,
          state: item.state,
        }));

        return items[0] ?? null;
      }

      return null;
    });
  }

  async getTideExtremesPoints({ lat, lng }: { lat: number; lng: number }) {
    return await this._stormglassClient.request(async (key) => {
      const todayDate = addDays(new Date(), 0);
      const response = await fetch(
        `${STORMGLASS_TIDE_EXTREMES_POINT_URL}?lat=${lat}&lng=${lng}&start=${format(todayDate, "yyyy-MM-dd")}`,
        {
          headers: {
            Authorization: key,
          },
        }
      );
      if (!response.ok) {
        throw new RequestRateLimitError(
          `Request failed with status: ${response.statusText}`
        );
      }
      const data = (await response.json()) as TideExtremesPointResponse;
      return {
        extremesPoints: data.data,
        station: data.meta.station,
        meta: {
          lat: data.meta.lat,
          lng: data.meta.lng,
          datum: data.meta.datum,
          end: data.meta.end,
          start: data.meta.start,
        },
      };
    });
  }

  async getPointWeather({ lat, lng }: { lat: number; lng: number }) {
    const currentTime = new Date().toISOString();
    // const endTime = format(addDays(new Date(), 1), "yyyy-MM-dd");
    const params = [
      "airTemperature",
      "pressure",
      "cloudCover",
      "currentDirection",
      "currentSpeed",
      "dewPointTemperature",
      "gust",
      "humidity",
      "iceCover",
      "precipitation",
      "rain",
      "snow",
      "graupel",
      "snowAlbedo",
      "snowDepth",
      "seaIceThickness",
      "seaLevel",
      "swellDirection",
      "swellHeight",
      "swellPeriod",
      "secondarySwellPeriod",
      "secondarySwellDirection",
      "secondarySwellHeight",
      "visibility",
      "waterTemperature",
      "waveDirection",
      "waveHeight",
      "wavePeriod",
      "windWaveDirection",
      "windWaveHeight",
      "windWavePeriod",
      "windDirection",
      "windSpeed",
    ];

    return await this._stormglassClient.request(async (key) => {
      const response = await fetch(
        `${STORMGLASS_POINT_WEATHER_URL}?lat=${lat}&lng=${lng}&start=${currentTime}&end=${currentTime}&params=${params.join(",")}`,
        {
          headers: { Authorization: key },
        }
      );
      if (!response.ok) {
        throw new RequestRateLimitError(
          `Request failed with status: ${response.statusText}`
        );
      }

      const data = (await response.json()) as PointWeatherResponse;
      const returnData = {
        hours: data.hours[0] ?? null,
        meta: {
          end: data.meta.end,
          start: data.meta.start,
          lat: data.meta.lat,
          lng: data.meta.lng,
          params: data.meta.params,
        },
      };
      return returnData;
    });
  }
}
