import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { bank, apply } from "../../adapters/inbound/http/bankingController";
import { getCB } from "../../adapters/inbound/http/complianceController";
import { createPoolAPI } from "../../adapters/inbound/http/poolController";

import { getRoutes, setBaseline, getComparison } from "../../adapters/inbound/http/routesController";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/compliance/cb", getCB);
app.post("/banking/bank", bank);
app.post("/banking/apply", apply);
app.post("/pools", createPoolAPI);

app.get("/routes", getRoutes);
app.post("/routes/:id/baseline", setBaseline);
app.get("/routes/comparison", getComparison);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});