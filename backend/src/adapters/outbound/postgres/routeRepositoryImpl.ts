import { RouteRepository } from "../../../core/ports/routeRepository";
import { Route } from "../../../core/domain/route";

let routes: Route[] = [
  {routeId: "R001", ghgIntensity: 91.0, fuelConsumption: 5000, year: 2024, isBaseline: true},
  {routeId: "R002", ghgIntensity: 88.0, fuelConsumption: 4800, year: 2024, isBaseline: false},
  {routeId: "R003", ghgIntensity: 93.5, fuelConsumption: 5100, year: 2024, isBaseline: false},
  {routeId: "R004", ghgIntensity: 89.2, fuelConsumption: 4900, year: 2025, isBaseline: false},
  {routeId: "R005", ghgIntensity: 90.5, fuelConsumption: 4950, year: 2025, isBaseline: false}
];

export class RouteRepositoryImpl implements RouteRepository {

  async getAllRoutes(): Promise<Route[]> {
    return routes;
  }

  async getBaseline(): Promise<Route | null> {
    return routes.find(r => r.isBaseline) || null;
  }

  async setBaseline(routeId: string): Promise<void> {
    routes.forEach(r => (r.isBaseline = false));
    const route = routes.find(r => r.routeId === routeId);
    if (route) route.isBaseline = true;
  }
}