export type GeoCoords = {
  lat: number;
  lng: number;
};

export type StoredLocation = GeoCoords & {
  name?: string;
  country?: string;
  state?: string;
  updatedAt: number;
};

const STORAGE_KEY = "tide-info:location" as const;

export function readStoredLocation(): StoredLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as StoredLocation;
    if (
      typeof parsed?.lat !== "number" ||
      Number.isNaN(parsed.lat) ||
      typeof parsed?.lng !== "number" ||
      Number.isNaN(parsed.lng)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredLocation(
  location: Omit<StoredLocation, "updatedAt">
): void {
  const value: StoredLocation = { ...location, updatedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function clearStoredLocation(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function getBrowserLocation(
  options?: PositionOptions
): Promise<GeoCoords> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported by this browser");
  }

  return await new Promise<GeoCoords>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
          reject(new Error("Invalid coordinates returned by browser"));
          return;
        }
        resolve({ lat: latitude, lng: longitude });
      },
      (error) => {
        reject(new Error(error.message || "Failed to get location"));
      },
      options ?? { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
    );
  });
}
