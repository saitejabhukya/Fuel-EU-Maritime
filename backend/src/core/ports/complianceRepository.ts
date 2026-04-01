export interface ComplianceRepository {
  getRoutesByYear(year: number): Promise<any[]>;
  saveCB(shipId: string, year: number, cb: number): Promise<any>;
}