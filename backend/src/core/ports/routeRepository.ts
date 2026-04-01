import { Route } from "../domain/route";

export interface RouteRepository {
  getAll(): Promise<Route[]>;
  getBaseline(): Promise<Route | null>;
  setBaseline(routeId: string): Promise<void>;
}