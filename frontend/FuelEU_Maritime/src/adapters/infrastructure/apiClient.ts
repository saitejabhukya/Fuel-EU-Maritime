import axios from "axios";
import type { Route, Comparison, ComplianceCB, AdjustedCB, BankKPIs, PoolMember } from "../../core/domain/types";
import type { RoutePort, CompliancePort, BankingPort, PoolingPort } from "../../core/ports/apiPorts";
import { API_BASE_URL } from "../../shared/constants";

const api = axios.create({ baseURL: API_BASE_URL });

export const routeClient: RoutePort = {
  getRoutes: () => api.get<Route[]>("/routes").then(r => r.data),

  setBaseline: (routeId: string) =>
    api.post(`/routes/${routeId}/baseline`).then(() => undefined),

  getComparison: () => api.get<Comparison[]>("/routes/comparison").then(r => r.data),
};

export const complianceClient: CompliancePort = {
  getCB: (shipId: string, year: number) =>
    api.get<ComplianceCB>("/compliance/cb", { params: { shipId, year } }).then(r => r.data),

  getAdjustedCB: (shipId: string, year: number) =>
    api.get<AdjustedCB>("/compliance/adjusted-cb", { params: { shipId, year } }).then(r => r.data),
};

export const bankingClient: BankingPort = {
  bank: (shipId: string, cb: number) =>
    api.post<{ banked: number }>("/banking/bank", { shipId, cb }).then(r => r.data),

  apply: (shipId: string, deficit: number, amount: number) =>
    api.post<BankKPIs>("/banking/apply", { shipId, deficit, amount }).then(r => r.data),
};

export const poolingClient: PoolingPort = {
  createPool: (members: { shipId: string; cb: number }[]) =>
    api.post<PoolMember[]>("/pools", { members }).then(r => r.data),
};
