import { useEffect, useState } from "react";
import type { Comparison } from "../types";
import { routeClient } from "../adapters/infrastructure/apiClient";
import { TARGET_GHG_INTENSITY } from "../shared/constants";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from "recharts";

export default function CompareTab() {
  const [data, setData] = useState<Comparison[]>([]);

  useEffect(() => {
    routeClient.getComparison().then(setData);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comparison</h2>

      <p className="text-sm text-gray-500 mb-4">
        Target intensity: <strong>{TARGET_GHG_INTENSITY} gCO₂e/MJ</strong> (2% below 91.16 — FuelEU 2025)
      </p>

      <table className="w-full border mb-6 rounded shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">GHG (gCO₂e/MJ)</th>
            <th className="p-2">% Diff vs Baseline</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr
              key={r.routeId}
              className={`text-center border-t ${r.isBaseline ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"}`}
            >
              <td className="p-2">
                {r.routeId}
                {r.isBaseline && (
                  <span className="ml-1 text-xs bg-blue-600 text-white px-1 rounded">BASELINE</span>
                )}
              </td>
              <td className="p-2">{r.ghgIntensity}</td>
              <td className="p-2">{r.isBaseline ? "—" : `${r.percentDiff.toFixed(2)}%`}</td>
              <td className="p-2">{r.compliant ? "✅ Compliant" : "❌ Non-compliant"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <BarChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="routeId" />
        <YAxis domain={[85, 96]} />
        <Tooltip />
        <Legend />
        <ReferenceLine
          y={TARGET_GHG_INTENSITY}
          stroke="red"
          strokeDasharray="5 5"
          label={{ value: "Target", position: "right", fill: "red" }}
        />
        <Bar
          dataKey="ghgIntensity"
          name="GHG Intensity (gCO₂e/MJ)"
          fill="#3b82f6"
        />
      </BarChart>
    </div>
  );
}