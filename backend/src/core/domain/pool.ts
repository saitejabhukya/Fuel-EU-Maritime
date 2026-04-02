export interface PoolMember {
  shipId: string;
  cb_before: number;
  cb_after: number;
}

export interface Pool {
  year: number;
  members: PoolMember[];
}