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
  isBaseline: boolean;
};

export type ComplianceCB = {
  shipId: string;
  year: number;
  cb: number;
};

export type AdjustedCB = {
  shipId: string;
  year: number;
  cb: number;
  banked: number;
  adjustedCB: number;
};

export type BankKPIs = {
  cb_before: number;
  applied: number;
  cb_after: number;
};

export type PoolMember = {
  shipId: string;
  cb_before: number;
  cb_after: number;
};
