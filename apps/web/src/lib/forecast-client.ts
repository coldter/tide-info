export type ReverseLocation = {
  name: string;
  lat: number;
  lng: number;
  country: string;
  state: string;
};

export type TideExtremePoint = {
  height: number;
  time: string; // ISO string
  type: string; // "high" | "low" or provider value
};

export type StationMeta = {
  distance: number;
  lat: number;
  lng: number;
  name: string;
  source: string;
};

// Minimal slice of the station weather we render
export type StationWeather = {
  hours: {
    airTemperature?: { [k: string]: number };
    cloudCover?: { [k: string]: number };
    currentDirection?: { [k: string]: number };
    currentSpeed?: { [k: string]: number };
    dewPointTemperature?: { [k: string]: number };
    gust?: { [k: string]: number };
    humidity?: { [k: string]: number };
    iceCover?: { [k: string]: number };
    precipitation?: { [k: string]: number };
    pressure?: { [k: string]: number };
    seaIceThickness?: { [k: string]: number };
    seaLevel?: { [k: string]: number };
    secondarySwellDirection?: { [k: string]: number };
    secondarySwellHeight?: { [k: string]: number };
    secondarySwellPeriod?: { [k: string]: number };
    snow?: { [k: string]: number };
    snowAlbedo?: { [k: string]: number };
    snowDepth?: { [k: string]: number };
    swellDirection?: { [k: string]: number };
    swellHeight?: { [k: string]: number };
    swellPeriod?: { [k: string]: number };
    time?: string;
    visibility?: { [k: string]: number };
    waterTemperature?: { [k: string]: number };
    waveDirection?: { [k: string]: number };
    waveHeight?: { [k: string]: number };
    wavePeriod?: { [k: string]: number };
    windDirection?: { [k: string]: number };
    windSpeed?: { [k: string]: number };
    windWaveDirection?: { [k: string]: number };
    windWaveHeight?: { [k: string]: number };
    windWavePeriod?: { [k: string]: number };
  } | null;
  meta: {
    end: string;
    start: string;
    lat: number;
    lng: number;
    params: string[];
  };
};

export type TideInfoResponse = {
  extremesPoints: TideExtremePoint[];
  stationWeather: StationWeather;
  station: StationMeta;
  nextTides: {
    nextTide: TideExtremePoint;
    nextHighTide: TideExtremePoint;
    nextLowTide: TideExtremePoint;
  };
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

export async function reverseSearchLocation(params: {
  lat: number;
  lng: number;
}): Promise<ReverseLocation> {
  const url = `${BASE_URL}/api/forecast/location/search/reverse?lat=${encodeURIComponent(params.lat)}&lng=${encodeURIComponent(params.lng)}`;
  return await fetchJson<ReverseLocation>(url);
}

export async function searchLocation(params: { q: string }): Promise<ReverseLocation[]> {
  const url = `${BASE_URL}/api/forecast/location/search?q=${encodeURIComponent(params.q)}`;
  return await fetchJson<ReverseLocation[]>(url);
}

export async function getTideInfo(params: {
  lat: number;
  lng: number;
}): Promise<TideInfoResponse> {
  const url = `${BASE_URL}/api/forecast/tide/info?lat=${encodeURIComponent(params.lat)}&lng=${encodeURIComponent(params.lng)}`;
  return await fetchJson<TideInfoResponse>(url);
}
