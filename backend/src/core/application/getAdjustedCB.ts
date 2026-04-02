import { ComplianceRepository } from "../ports/complianceRepository";
import { BankRepository } from "../ports/bankRepository";

export class GetAdjustedCB {
  constructor(
    private complianceRepo: ComplianceRepository,
    private bankRepo: BankRepository
  ) {}

  async execute(shipId: string, year: number) {
    const cb = await this.complianceRepo.getTotalCB(shipId, year);
    const banked = await this.bankRepo.getBanked(shipId);
    return { shipId, year, cb, banked, adjustedCB: cb + banked };
  }
}
