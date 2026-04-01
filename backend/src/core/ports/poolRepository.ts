export interface PoolRepository {
  savePool(result: any): Promise<void>;
}