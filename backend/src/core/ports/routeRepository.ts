import { Route } from "../domain/route";

export interface RouteRepository {
  getAllRoutes(): Promise<Route[]>;
  getBaseline(): Promise<Route | null>;
  setBaseline(routeId: string): Promise<void>;
}