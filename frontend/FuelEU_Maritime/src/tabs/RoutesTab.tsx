import { useEffect, useState } from "react";
import axios from "axios";

interface Route {
  routeId: string;
  ghgIntensity: number;
  fuelConsumption: number;
  year: number;
}

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/routes")
      .then(res => setRoutes(res.data));
  }, []);

  const setBaseline = (id: string) => {
    axios.post(`http://localhost:3000/routes/${id}/baseline`);
  };

  const filtered = routes.filter(r =>
    r.routeId.includes(filter)
  );

  return (
    <div>
      <input
        placeholder="Filter by Route ID"
        className="border p-2 mb-2"
        onChange={(e) => setFilter(e.target.value)}
      />

      <table className="table-auto border w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>GHG</th>
            <th>Fuel</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.routeId}>
              <td>{r.routeId}</td>
              <td>{r.ghgIntensity}</td>
              <td>{r.fuelConsumption}</td>
              <td>
                <button
                  onClick={() => setBaseline(r.routeId)}
                  className="bg-green-500 text-white px-2 py-1"
                >
                  Set Baseline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}