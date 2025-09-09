export type ReverseLocation = {
  name: string;
  lat: number;
  lng: number;
  country: string;
  state: string;
};

export type TidePoint = {
  height: number;
  time: string;
  type: string;
};

export type WeatherData = {
  airTemperature: {
    ecmwf: number;
    "ecmwf:aifs": number;
    noaa: number;
    sg: number;
  };
  cloudCover: { noaa: number; sg: number };
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
  gust: { ecmwf: number; noaa: number; sg: number };
  humidity: { noaa: number; sg: number };
  iceCover: { noaa: number; sg: number };
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
  seaIceThickness: { ecmwf: number; sg: number };
  seaLevel: { meto: number; sg: number };
  secondarySwellDirection: { noaa: number; sg: number };
  secondarySwellHeight: { noaa: number; sg: number };
  secondarySwellPeriod: { noaa: number; sg: number };
  snow: { "ecmwf:aifs": number; sg: number };
  snowAlbedo: { ecmwf: number; sg: number };
  snowDepth: { noaa: number; sg: number };
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
  visibility: { noaa: number; sg: number };
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
};

export type TideInfoResponse = {
  extremesPoints: TidePoint[];
  stationWeather: {
    hours: WeatherData;
    meta: {
      end: string;
      start: string;
      lat: number;
      lng: number;
      params: string[];
    };
  };
  station: {
    distance: number;
    lat: number;
    lng: number;
    name: string;
    source: string;
  };
  nextTides: {
    nextTide: TidePoint;
    nextHighTide: TidePoint;
    nextLowTide: TidePoint;
  };
};

export type SearchLocation = {
  name: string;
  lat: number;
  lng: number;
  country: string;
  state: string;
};

const BASE_URL = import.meta.env.VITE_SERVER_URL as string;

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function searchLocation(query: string): Promise<SearchLocation[]> {
  const url = `${BASE_URL}/api/forecast/location/search?q=${encodeURIComponent(query)}`;
  return await fetchJson<SearchLocation[]>(url);
}

export async function reverseSearchLocation(params: {
  lat: number;
  lng: number;
}): Promise<ReverseLocation> {
  const url = `${BASE_URL}/api/forecast/location/search/reverse?lat=${encodeURIComponent(params.lat)}&lng=${encodeURIComponent(params.lng)}`;
  return await fetchJson<ReverseLocation>(url);
}

export async function getTideInfo(params: {
  lat: number;
  lng: number;
}): Promise<TideInfoResponse> {
  const url = `${BASE_URL}/api/forecast/tide/info?lat=${encodeURIComponent(params.lat)}&lng=${encodeURIComponent(params.lng)}`;
  return await fetchJson<TideInfoResponse>(url);
}
