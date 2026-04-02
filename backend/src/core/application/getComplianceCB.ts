import { ComplianceRepository } from "../ports/complianceRepository";
import { ComputeCB } from "./computeCB";

export class GetComplianceCB {
  constructor(private repo: ComplianceRepository) {}

  async execute(shipId: string, year: number) {
    const routes = await this.repo.getRoutesByYear(year);
    const compute = new ComputeCB();

    await this.repo.deleteCBByShipYear(shipId, year);

    let total = 0;
    for (const r of routes) {
      const cb = compute.execute(r);
      await this.repo.saveCB(shipId, year, cb);
      total += cb;
    }

    return { shipId, year, cb: total };
  }
}