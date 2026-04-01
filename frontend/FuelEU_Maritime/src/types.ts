export type Route = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
};

export type Comparison = {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
};