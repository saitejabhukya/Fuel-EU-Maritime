import { Request, Response } from "express";
import { prisma } from "../../../infrastructure/db/prismaClient";
import { createPool } from "../../../core/application/createPool";

type PoolInput = {
  shipId: string;
  cb: number;
};

export const createPoolAPI = async (req: Request, res: Response) => {
  const { year, members }: { year: number; members: PoolInput[] } = req.body;

  try {
    // Save pool
    const pool = await prisma.pool.create({
      data: { year }
    });

    // Apply pooling logic
    const updated = createPool(members);

    // Save members
    const savedMembers = await Promise.all(
      updated.map(m =>
        prisma.poolMember.create({
          data: {
            poolId: pool.id,
            shipId: m.shipId,
            cbBefore: members.find(x => x.shipId === m.shipId)?.cb || 0,
            cbAfter: m.cb_after
          }
        })
      )
    );

    res.json({
      pool,
      members: savedMembers
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};