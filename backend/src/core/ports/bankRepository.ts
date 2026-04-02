export interface BankRepository {
  getBanked(shipId: string): Promise<number>;
  saveBanked(shipId: string, amount: number): Promise<void>;
  getRecords(shipId: string, year: number): Promise<Array<{ shipId: string; year: number; amount: number }>>;
}