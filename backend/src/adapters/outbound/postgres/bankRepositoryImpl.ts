import { prisma } from "../../../infrastructure/db/prismaClient";

export class BankRepositoryImpl {

  async getBanked(shipId: string) {
    const records = await prisma.bankEntry.findMany({
      where: { shipId }
    });

    return records.reduce((sum, r) => sum + r.amount, 0);
  }

  async saveBanked(shipId: string, amount: number) {
    await prisma.bankEntry.create({
      data: {
        shipId,
        year: new Date().getFullYear(),
        amount
      }
    });
  }
}