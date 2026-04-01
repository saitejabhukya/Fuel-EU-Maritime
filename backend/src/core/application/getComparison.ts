import { RouteRepository } from "../ports/routeRepository";

export class GetComparison {
  constructor(private repo: RouteRepository) {}

  async execute() {
    const routes = await this.repo.getAll();
    const baseline = await this.repo.getBaseline();

    if (!baseline) throw new Error("No baseline");

    return routes.map(r => {
      const percentDiff =
        ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;

      return {
        routeId: r.routeId,
        ghgIntensity: r.ghgIntensity,
        percentDiff,
        compliant: r.ghgIntensity <= 89.3368
      };
    });
  }
}