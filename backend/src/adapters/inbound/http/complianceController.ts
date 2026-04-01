import { Request, Response } from "express";
import { ComplianceRepositoryImpl } from "../../outbound/postgres/complianceRepositoryImpl";
import { GetComplianceCB } from "../../../core/application/getComplianceCB";

const repo = new ComplianceRepositoryImpl();

export const getCB = async (req: Request, res: Response) => {
  try {
    const shipId = String(req.query.shipId);
    const year = Number(req.query.year);

    const usecase = new GetComplianceCB(repo);
    const result = await usecase.execute(shipId, year);

    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};