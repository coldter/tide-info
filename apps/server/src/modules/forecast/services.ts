type TidePointsData = {
  height: number;
  time: string;
  type: string;
}[];

interface NextTidesResult {
  nextTide: TidePointsData[number];
  nextHighTide: TidePointsData[number];
  nextLowTide: TidePointsData[number];
}

export function getNextTides(tidePoints: TidePointsData): NextTidesResult {
  const now = new Date();

  const futureTides = tidePoints
    .filter((tide) => new Date(tide.time) > now)
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  const nextTide = futureTides[0];

  const nextHighTide = futureTides.find((tide) => tide.type === "high")!;

  const nextLowTide = futureTides.find((tide) => tide.type === "low")!;

  return {
    nextTide,
    nextHighTide,
    nextLowTide,
  };
}
