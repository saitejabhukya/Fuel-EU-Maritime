import { PoolRepository } from "../ports/poolRepository";
import { PoolMember } from "../domain/pool";

export class CreatePool {
  constructor(private repo: PoolRepository) {}

  async execute(members: { shipId: string; cb: number }[]) {
    const originalCBs = new Map(members.map(m => [m.shipId, m.cb]));

    members.sort((a, b) => b.cb - a.cb);

    const surplus = members.filter(m => m.cb > 0);
    const deficit = members.filter(m => m.cb < 0);

    for (const d of deficit) {
      for (const s of surplus) {
        if (s.cb <= 0) continue;

        const transfer = Math.min(s.cb, -d.cb);
        s.cb -= transfer;
        d.cb += transfer;

        if (d.cb === 0) break;
      }
    }

    const total = members.reduce((sum, m) => sum + m.cb, 0);
    if (total < 0) throw new Error("Invalid pool: total CB is negative");

    const result: PoolMember[] = members.map(m => ({
      shipId: m.shipId,
      cb_before: originalCBs.get(m.shipId) ?? 0,
      cb_after: m.cb
    }));

    await this.repo.savePool(result, new Date().getFullYear());

    return result;
  }
}