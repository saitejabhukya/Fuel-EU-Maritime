import { RouteRepository } from "../ports/routeRepository";

export class SetBaseline {
  constructor(private repo: RouteRepository) {}

  async execute(routeId: string) {
    await this.repo.setBaseline(routeId);
  }
}