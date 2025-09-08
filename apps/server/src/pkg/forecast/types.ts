export interface SearchLocationResponse {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface TideExtremesPointResponse {
  data: Array<{
    height: number;
    time: string;
    type: string;
  }>;
  meta: {
    cost: number;
    dailyQuota: number;
    datum: string;
    end: string;
    lat: number;
    lng: number;
    offset: number;
    requestCount: number;
    start: string;
    station: {
      distance: number;
      lat: number;
      lng: number;
      name: string;
      source: string;
    };
  };
}

export interface PointWeatherResponse {
  hours: Array<{
    airTemperature: {
      ecmwf: number;
      "ecmwf:aifs": number;
      noaa: number;
      sg: number;
    };
    cloudCover: {
      noaa: number;
      sg: number;
    };
    currentDirection: {
      ecmwf: number;
      meto: number;
      sg: number;
    };
    currentSpeed: {
      ecmwf: number;
      meto: number;
      sg: number;
    };
    dewPointTemperature: {
      ecmwf: number;
      "ecmwf:aifs": number;
      noaa: number;
      sg: number;
    };
    gust: {
      ecmwf: number;
      noaa: number;
      sg: number;
    };
    humidity: {
      noaa: number;
      sg: number;
    };
    iceCover: {
      noaa: number;
      sg: number;
    };
    precipitation: {
      ecmwf: number;
      "ecmwf:aifs": number;
      noaa: number;
      sg: number;
    };
    pressure: {
      ecmwf: number;
      "ecmwf:aifs": number;
      noaa: number;
      sg: number;
    };
    seaIceThickness: {
      ecmwf: number;
      sg: number;
    };
    seaLevel: {
      meto: number;
      sg: number;
    };
    secondarySwellDirection: {
      noaa: number;
      sg: number;
    };
    secondarySwellHeight: {
      noaa: number;
      sg: number;
    };
    secondarySwellPeriod: {
      noaa: number;
      sg: number;
    };
    snow: {
      "ecmwf:aifs": number;
      sg: number;
    };
    snowAlbedo: {
      ecmwf: number;
      sg: number;
    };
    snowDepth: {
      noaa: number;
      sg: number;
    };
    swellDirection: {
      meteo: number;
      noaa: number;
      sg: number;
    };
    swellHeight: {
      meteo: number;
      noaa: number;
      sg: number;
    };
    swellPeriod: {
      meteo: number;
      noaa: number;
      sg: number;
    };
    time: string;
    visibility: {
      noaa: number;
      sg: number;
    };
    waterTemperature: {
      meto: number;
      noaa: number;
      sg: number;
    };
    waveDirection: {
      ecmwf: number;
      meteo: number;
      noaa: number;
      sg: number;
    };
    waveHeight: {
      ecmwf: number;
      meteo: number;
      noaa: number;
      sg: number;
    };
    wavePeriod: {
      ecmwf: number;
      meteo: number;
      noaa: number;
      sg: number;
    };
    windDirection: {
      ecmwf: number;
      "ecmwf:aifs": number;
      noaa: number;
      sg: number;
    };
    windSpeed: {
      ecmwf: number;
      "ecmwf:aifs": number;
      noaa: number;
      sg: number;
    };
    windWaveDirection: {
      meteo: number;
      noaa: number;
      sg: number;
    };
    windWaveHeight: {
      meteo: number;
      noaa: number;
      sg: number;
    };
    windWavePeriod: {
      meteo: number;
      noaa: number;
      sg: number;
    };
  }>;
  meta: {
    cost: number;
    dailyQuota: number;
    end: string;
    lat: number;
    lng: number;
    params: string[];
    requestCount: number;
    start: string;
  };
}
