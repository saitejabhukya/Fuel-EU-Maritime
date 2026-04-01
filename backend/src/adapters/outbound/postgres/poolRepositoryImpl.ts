import { prisma } from "../../../infrastructure/db/prismaClient";
import { PoolRepository } from "../../../core/ports/poolRepository";
import { PoolMember } from "../../../core/domain/pool";

export class PoolRepositoryImpl implements PoolRepository {

  async savePool(members: PoolMember[], year: number) {
    const pool = await prisma.pool.create({
      data: { year }
    });

    for (const m of members) {
      await prisma.poolMember.create({
        data: {
          poolId: pool.id,
          shipId: m.shipId,
          cbBefore: m.cb_before,
          cbAfter: m.cb_after
        }
      });
    }
  }
}