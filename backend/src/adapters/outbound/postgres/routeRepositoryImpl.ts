import { prisma } from "../../../infrastructure/db/prismaClient";
import { RouteRepository } from "../../../core/ports/routeRepository";

export class RouteRepositoryImpl implements RouteRepository {

  async getAll() {
    return prisma.route.findMany();
  }

  async getBaseline() {
    return prisma.route.findFirst({
      where: { isBaseline: true }
    });
  }

  async setBaseline(routeId: string) {
    await prisma.route.updateMany({
      data: { isBaseline: false }
    });

    await prisma.route.updateMany({
      where: { routeId },
      data: { isBaseline: true }
    });
  }
}