import { Route } from "../domain/route";

export interface ComplianceRepository {
  getRoutesByYear(year: number): Promise<Route[]>;
  saveCB(shipId: string, year: number, cb: number): Promise<void>;
  deleteCBByShipYear(shipId: string, year: number): Promise<void>;
  getTotalCB(shipId: string, year: number): Promise<number>;
}