import { Request, Response } from "express";
import { BankRepositoryImpl } from "../../outbound/postgres/bankRepositoryImpl";
import { BankSurplus } from "../../../core/application/bankSurplus";
import { ApplyBanked } from "../../../core/application/applyBanked";

const repo = new BankRepositoryImpl();

export const bank = async (req: Request, res: Response) => {
  const usecase = new BankSurplus(repo);
  const result = await usecase.execute(req.body.shipId, req.body.cb);
  res.json(result);
};

export const apply = async (req: Request, res: Response) => {
  const usecase = new ApplyBanked(repo);
  const result = await usecase.execute(
    req.body.shipId,
    req.body.deficit,
    req.body.amount
  );
  res.json(result);
};