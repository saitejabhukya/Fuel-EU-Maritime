import { Request, Response } from "express";
import { PoolRepositoryImpl } from "../../outbound/postgres/poolRepositoryImpl";
import { CreatePool } from "../../../core/application/createPool";

const repo = new PoolRepositoryImpl();

export const createPoolAPI = async (req: Request, res: Response) => {
  try {
    const usecase = new CreatePool(repo);
    const result = await usecase.execute(req.body.members);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};