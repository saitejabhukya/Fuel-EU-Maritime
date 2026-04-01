import { prisma } from "../../../infrastructure/db/prismaClient";
import { ComplianceRepository } from "../../../core/ports/complianceRepository";

export class ComplianceRepositoryImpl implements ComplianceRepository {

  async getRoutesByYear(year: number) {
    return prisma.route.findMany({
      where: { year }
    });
  }

  async saveCB(shipId: string, year: number, cb: number) {
    return prisma.shipCompliance.create({
      data: {
        shipId,
        year,
        cb
      }
    });
  }
}