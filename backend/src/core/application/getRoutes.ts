import { RouteRepository } from "../ports/routeRepository";

export class GetRoutes {
  constructor(private repo: RouteRepository) {}

  async execute() {
    return this.repo.getAllRoutes();
  }
}