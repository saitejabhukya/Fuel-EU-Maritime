import { PoolRepository } from "../../../core/ports/poolRepository";

export class PoolRepositoryImpl implements PoolRepository {
  async savePool(result: any) {
    console.log("Pool saved:", result);
  }
}