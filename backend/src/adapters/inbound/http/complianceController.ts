import { Request, Response } from "express";
import { prisma } from "../../../infrastructure/db/prismaClient";
import { computeCB } from "../../../core/application/computeCB";

export const getCB = async (req: Request, res: Response) => {
  const { shipId, year } = req.query;

  try {
    const routes = await prisma.route.findMany({
      where: { year: Number(year) }
    });

    const results = [];

    for (let r of routes) {
      const cb = computeCB(r);

      const saved = await prisma.shipCompliance.create({
        data: {
          shipId: String(shipId),
          year: Number(year),
          cb
        }
      });

      results.push(saved);
    }

    res.json(results);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};