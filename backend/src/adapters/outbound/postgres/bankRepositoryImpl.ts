import { prisma } from "../../../infrastructure/db/prismaClient";
import { BankRepository } from "../../../core/ports/bankRepository";

export class BankRepositoryImpl implements BankRepository {

  async getBanked(shipId: string) {
    const records = await prisma.bankEntry.findMany({
      where: { shipId }
    });
    return records.reduce((sum, r) => sum + r.amount, 0);
  }

  async saveBanked(shipId: string, amount: number) {
    await prisma.bankEntry.deleteMany({ where: { shipId } });
    if (amount > 0) {
      await prisma.bankEntry.create({
        data: {
          shipId,
          year: new Date().getFullYear(),
          amount
        }
      });
    }
  }

  async getRecords(shipId: string, year: number) {
    return prisma.bankEntry.findMany({ where: { shipId, year } });
  }
}