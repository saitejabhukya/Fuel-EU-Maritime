import { prisma } from "../../../infrastructure/db/prismaClient";

export class PoolRepositoryImpl {

  async savePool(result: any) {
    const pool = await prisma.pool.create({
      data: { year: new Date().getFullYear() }
    });

    for (let m of result) {
      await prisma.poolMember.create({
        data: {
          poolId: pool.id,
          shipId: m.shipId,
          cbBefore: 0,
          cbAfter: m.cb_after
        }
      });
    }
  }
}