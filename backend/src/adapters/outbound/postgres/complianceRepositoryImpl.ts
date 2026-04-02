import { prisma } from "../../../infrastructure/db/prismaClient";
import { ComplianceRepository } from "../../../core/ports/complianceRepository";

export class ComplianceRepositoryImpl implements ComplianceRepository {

  async getRoutesByYear(year: number) {
    return prisma.route.findMany({
      where: { year }
    });
  }

  async deleteCBByShipYear(shipId: string, year: number) {
    await prisma.shipCompliance.deleteMany({
      where: { shipId, year }
    });
  }

  async saveCB(shipId: string, year: number, cb: number) {
    await prisma.shipCompliance.create({
      data: { shipId, year, cb }
    });
  }

  async getTotalCB(shipId: string, year: number) {
    const records = await prisma.shipCompliance.findMany({
      where: { shipId, year }
    });
    return records.reduce((sum, r) => sum + r.cb, 0);
  }
}