import type { Route, Comparison, ComplianceCB, AdjustedCB, BankKPIs, PoolMember } from "../domain/types";

export interface RoutePort {
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<Comparison[]>;
}

export interface CompliancePort {
  getCB(shipId: string, year: number): Promise<ComplianceCB>;
  getAdjustedCB(shipId: string, year: number): Promise<AdjustedCB>;
}

export interface BankingPort {
  bank(shipId: string, cb: number): Promise<{ banked: number }>;
  apply(shipId: string, deficit: number, amount: number): Promise<BankKPIs>;
}

export interface PoolingPort {
  createPool(members: { shipId: string; cb: number }[]): Promise<PoolMember[]>;
}
