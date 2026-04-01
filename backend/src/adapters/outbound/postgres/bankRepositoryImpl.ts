import { BankRepository } from "../../../core/ports/bankRepository";

let store: Record<string, number> = {};

export class BankRepositoryImpl implements BankRepository {
  async getBanked(shipId: string) {
    return store[shipId] || 0;
  }

  async saveBanked(shipId: string, amount: number) {
    store[shipId] = amount;
  }
}