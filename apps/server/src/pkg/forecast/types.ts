export interface SearchLocationResponse {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface TideExtremesPointResponse {
  extremesPoints: {
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
  };
}
