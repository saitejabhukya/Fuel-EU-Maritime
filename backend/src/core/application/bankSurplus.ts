import { BankRepository } from "../ports/bankRepository";

export class BankSurplus {
  constructor(private repo: BankRepository) {}

  async execute(shipId: string, cb: number) {
    if (cb <= 0) throw new Error("Cannot bank negative CB");

    const current = await this.repo.getBanked(shipId);
    await this.repo.saveBanked(shipId, current + cb);

    return { banked: cb };
  }
}