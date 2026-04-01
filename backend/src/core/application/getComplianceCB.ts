import { ComplianceRepository } from "../ports/complianceRepository";
import { ComputeCB } from "./computeCB";

export class GetComplianceCB {
  constructor(private repo: ComplianceRepository) {}

  async execute(shipId: string, year: number) {
    const routes = await this.repo.getRoutesByYear(year);

    const compute = new ComputeCB();

    const results = [];

    for (let r of routes) {
      const cb = compute.execute(r);

      const saved = await this.repo.saveCB(shipId, year, cb);

      results.push(saved);
    }

    return results;
  }
}