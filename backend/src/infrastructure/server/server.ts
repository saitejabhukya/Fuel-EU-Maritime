import express from "express";
import cors from "cors";

// ✅ IMPORT CONTROLLER
import { getRoutes } from "../../adapters/inbound/http/routesController";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROOT TEST
app.get("/", (req, res) => {
  res.send("API running");
});

// ✅ NEW ROUTE API
app.get("/routes", getRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});