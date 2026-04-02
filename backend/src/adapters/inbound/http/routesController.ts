import { Request, Response } from "express";
import { RouteRepositoryImpl } from "../../outbound/postgres/routeRepositoryImpl";
import { GetRoutes } from "../../../core/application/getRoutes";
import { SetBaseline } from "../../../core/application/setBaseline";
import { GetComparison } from "../../../core/application/getComparison";

const repo = new RouteRepositoryImpl();

export const getRoutes = async (req: Request, res: Response) => {
  const usecase = new GetRoutes(repo);
  const result = await usecase.execute();
  res.json(result);
};

export const setBaseline = async (req: Request, res: Response) => {
  const usecase = new SetBaseline(repo);
  await usecase.execute(req.params.id as string);
  res.json({ message: "Baseline set" });
};

export const getComparison = async (req: Request, res: Response) => {
  const usecase = new GetComparison(repo);
  const result = await usecase.execute();
  res.json(result);
};