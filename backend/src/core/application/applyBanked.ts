import { BankRepository } from "../ports/bankRepository";

export class ApplyBanked {
  constructor(private repo: BankRepository) {}

  async execute(shipId: string, deficit: number, amount: number) {
    const banked = await this.repo.getBanked(shipId);

    if (amount > banked) throw new Error("Not enough banked");
    if (deficit >= 0) throw new Error("No deficit");

    const newCB = deficit + amount;

    await this.repo.saveBanked(shipId, banked - amount);

    return {
      cb_before: deficit,
      applied: amount,
      cb_after: newCB
    };
  }
}