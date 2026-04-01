import { Route } from "../domain/route";

export class ComputeCB {
  execute(route: Route): number {
    const TARGET = 89.3368;
    const energy = route.fuelConsumption * 41000;

    return (TARGET - route.ghgIntensity) * energy;
  }
}