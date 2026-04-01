import { TARGET_GHG_INTENSITY, ENERGY_CONVERSION_FACTOR } from "../../shared/constants";

export function computeComplianceBalance(ghgIntensity: number, fuelConsumption: number): number {
  const energy = fuelConsumption * ENERGY_CONVERSION_FACTOR;
  return (TARGET_GHG_INTENSITY - ghgIntensity) * energy;
}

export function isCompliant(ghgIntensity: number): boolean {
  return ghgIntensity <= TARGET_GHG_INTENSITY;
}

export function computePercentDiff(actual: number, baseline: number): number {
  return ((actual / baseline) - 1) * 100;
}

export function computePoolSum(members: { cb: number }[]): number {
  return members.reduce((sum, m) => sum + m.cb, 0);
}

export function isPoolValid(members: { cb: number }[]): boolean {
  return computePoolSum(members) >= 0;
}
