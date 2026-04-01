import { Request, Response } from "express";
import { prisma } from "../../../infrastructure/db/prismaClient";
import { bankSurplus } from "../../../core/application/bankSurplus";
import { applyBanked } from "../../../core/application/applyBanked";

export const bank = async (req: Request, res: Response) => {
  const { shipId, year, cb } = req.body;

  try {
    const amount = bankSurplus(cb);

    const entry = await prisma.bankEntry.create({
      data: { shipId, year, amount }
    });

    res.json(entry);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const apply = async (req: Request, res: Response) => {
  const { shipId, year, deficit, amount } = req.body;

  try {
    const records = await prisma.bankEntry.findMany({
      where: { shipId, year }
    });

    const totalBanked = records.reduce((sum: number, r: { amount: number }) => sum + r.amount, 0);

    const result = applyBanked(deficit, totalBanked, amount);

    await prisma.bankEntry.deleteMany({
      where: { shipId, year }
    });

    if (result.remainingBanked > 0) {
      await prisma.bankEntry.create({
        data: {
          shipId,
          year,
          amount: result.remainingBanked
        }
      });
    }

    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};