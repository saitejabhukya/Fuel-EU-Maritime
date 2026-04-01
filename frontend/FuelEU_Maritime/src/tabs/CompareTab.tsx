import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface ComparisonRoute {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
}


export default function CompareTab() {
  const [data, setData] = useState<ComparisonRoute[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/routes/comparison")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <table className="border w-full mb-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>GHG</th>
            <th>% Diff</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.routeId}>
              <td>{r.routeId}</td>
              <td>{r.ghgIntensity}</td>
              <td>{r.percentDiff.toFixed(2)}%</td>
              <td>{r.compliant ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="routeId" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="ghgIntensity" />
      </BarChart>
    </div>
  );
}