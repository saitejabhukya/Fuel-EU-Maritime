import { Request, Response } from "express";
import { ComplianceRepositoryImpl } from "../../outbound/postgres/complianceRepositoryImpl";
import { BankRepositoryImpl } from "../../outbound/postgres/bankRepositoryImpl";
import { GetComplianceCB } from "../../../core/application/getComplianceCB";
import { GetAdjustedCB } from "../../../core/application/getAdjustedCB";

const complianceRepo = new ComplianceRepositoryImpl();
const bankRepo = new BankRepositoryImpl();

export const getCB = async (req: Request, res: Response) => {
  try {
    const shipId = String(req.query.shipId);
    const year = Number(req.query.year);

    const usecase = new GetComplianceCB(complianceRepo);
    const result = await usecase.execute(shipId, year);

    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const getAdjustedCB = async (req: Request, res: Response) => {
  try {
    const shipId = String(req.query.shipId);
    const year = Number(req.query.year);

    const usecase = new GetAdjustedCB(complianceRepo, bankRepo);
    const result = await usecase.execute(shipId, year);

    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};