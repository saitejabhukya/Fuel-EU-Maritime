import { PoolMember } from "../domain/pool";

export interface PoolRepository {
  savePool(members: PoolMember[], year: number): Promise<void>;
}