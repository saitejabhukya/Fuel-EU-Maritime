import { Request, Response } from "express";

let routes = [
  { routeId: "R001", ghgIntensity: 91.0, fuelConsumption: 5000, year: 2024 }
];

export const getRoutes = (req: Request, res: Response) => {
  res.json(routes);
};