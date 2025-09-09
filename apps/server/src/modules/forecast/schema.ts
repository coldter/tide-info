import { z } from "@hono/zod-openapi";

export const getTideInfoResponseSchema = z.object({
  extremesPoints: z.array(
    z.object({ height: z.number(), time: z.string(), type: z.string() })
  ),
  stationWeather: z.object({
    hours: z.object({
      airTemperature: z.object({
        ecmwf: z.number(),
        "ecmwf:aifs": z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      cloudCover: z.object({ noaa: z.number(), sg: z.number() }),
      currentDirection: z.object({
        ecmwf: z.number(),
        meto: z.number(),
        sg: z.number(),
      }),
      currentSpeed: z.object({
        ecmwf: z.number(),
        meto: z.number(),
        sg: z.number(),
      }),
      dewPointTemperature: z.object({
        ecmwf: z.number(),
        "ecmwf:aifs": z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      gust: z.object({ ecmwf: z.number(), noaa: z.number(), sg: z.number() }),
      humidity: z.object({ noaa: z.number(), sg: z.number() }),
      iceCover: z.object({ noaa: z.number(), sg: z.number() }),
      precipitation: z.object({
        ecmwf: z.number(),
        "ecmwf:aifs": z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      pressure: z.object({
        ecmwf: z.number(),
        "ecmwf:aifs": z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      seaIceThickness: z.object({ ecmwf: z.number(), sg: z.number() }),
      seaLevel: z.object({ meto: z.number(), sg: z.number() }),
      secondarySwellDirection: z.object({ noaa: z.number(), sg: z.number() }),
      secondarySwellHeight: z.object({ noaa: z.number(), sg: z.number() }),
      secondarySwellPeriod: z.object({ noaa: z.number(), sg: z.number() }),
      snow: z.object({ "ecmwf:aifs": z.number(), sg: z.number() }),
      snowAlbedo: z.object({ ecmwf: z.number(), sg: z.number() }),
      snowDepth: z.object({ noaa: z.number(), sg: z.number() }),
      swellDirection: z.object({
        meteo: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      swellHeight: z.object({
        meteo: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      swellPeriod: z.object({
        meteo: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      time: z.string(),
      visibility: z.object({ noaa: z.number(), sg: z.number() }),
      waterTemperature: z.object({
        meto: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      waveDirection: z.object({
        ecmwf: z.number(),
        meteo: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      waveHeight: z.object({
        ecmwf: z.number(),
        meteo: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      wavePeriod: z.object({
        ecmwf: z.number(),
        meteo: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      windDirection: z.object({
        ecmwf: z.number(),
        "ecmwf:aifs": z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      windSpeed: z.object({
        ecmwf: z.number(),
        "ecmwf:aifs": z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      windWaveDirection: z.object({
        meteo: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      windWaveHeight: z.object({
        meteo: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
      windWavePeriod: z.object({
        meteo: z.number(),
        noaa: z.number(),
        sg: z.number(),
      }),
    }),
    meta: z.object({
      end: z.string(),
      start: z.string(),
      lat: z.number(),
      lng: z.number(),
      params: z.array(z.string()),
    }),
  }),
  station: z.object({
    distance: z.number(),
    lat: z.number(),
    lng: z.number(),
    name: z.string(),
    source: z.string(),
  }),
  nextTides: z.object({
    nextTide: z.object({
      height: z.number(),
      time: z.string(),
      type: z.string(),
    }),
    nextHighTide: z.object({
      height: z.number(),
      time: z.string(),
      type: z.string(),
    }),
    nextLowTide: z.object({
      height: z.number(),
      time: z.string(),
      type: z.string(),
    }),
  }),
});

export const searchLocationResponseSchema = z
  .object({
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
    country: z.string(),
    state: z.string(),
  })
  .array();

export const reverseSearchLocationResponseSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  country: z.string(),
  state: z.string(),
});
