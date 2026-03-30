export function computeCB(route: any): number {
  const TARGET = 89.3368;
  const energy = route.fuelConsumption * 41000;

  return (TARGET - route.ghgIntensity) * energy;
}