export interface BankRepository {
  getBanked(shipId: string): Promise<number>;
  saveBanked(shipId: string, amount: number): Promise<void>;
}