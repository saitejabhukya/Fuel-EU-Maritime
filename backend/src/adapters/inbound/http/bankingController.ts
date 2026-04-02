import { Request, Response } from "express";
import { BankRepositoryImpl } from "../../outbound/postgres/bankRepositoryImpl";
import { BankSurplus } from "../../../core/application/bankSurplus";
import { ApplyBanked } from "../../../core/application/applyBanked";

const repo = new BankRepositoryImpl();

export const getRecords = async (req: Request, res: Response) => {
  try {
    const shipId = String(req.query.shipId);
    const year = Number(req.query.year);
    const records = await repo.getRecords(shipId, year);
    res.json(records);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const bank = async (req: Request, res: Response) => {
  try {
    const usecase = new BankSurplus(repo);
    const result = await usecase.execute(req.body.shipId, req.body.cb);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const apply = async (req: Request, res: Response) => {
  try {
    const usecase = new ApplyBanked(repo);
    const result = await usecase.execute(
      req.body.shipId,
      req.body.deficit,
      req.body.amount
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};