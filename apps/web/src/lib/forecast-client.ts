export type ReverseLocation = {
  name: string;
  lat: number;
  lng: number;
  country: string;
  state: string;
};

export type TideInfoResponse = {
  extremesPoints: unknown;
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

export async function getTideInfo(params: {
  lat: number;
  lng: number;
}): Promise<TideInfoResponse> {
  const url = `${BASE_URL}/api/forecast/tide/info?lat=${encodeURIComponent(params.lat)}&lng=${encodeURIComponent(params.lng)}`;
  return await fetchJson<TideInfoResponse>(url);
}
