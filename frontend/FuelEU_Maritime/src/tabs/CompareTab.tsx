import { useEffect, useState } from "react";
import axios from "axios";
import type { Comparison } from "../types";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

export default function CompareTab() {
  const [data, setData] = useState<Comparison[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/routes/comparison")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comparison</h2>

      <table className="w-full border mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>GHG</th>
            <th>% Diff</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map(r => (
            <tr key={r.routeId} className="text-center border-t">
              <td>{r.routeId}</td>
              <td>{r.ghgIntensity}</td>
              <td>{r.percentDiff.toFixed(2)}%</td>
              <td>{r.compliant ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <BarChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="routeId" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="ghgIntensity" fill="#3b82f6" />
      </BarChart>
    </div>
  );
}