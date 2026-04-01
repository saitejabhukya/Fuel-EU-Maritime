import { useEffect, useState } from "react";
import axios from "axios";
import type { Route } from "../types";

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vesselFilter, setVesselFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const filtered = routes.filter((r) => {
    return (
      (!vesselFilter || r.vesselType === vesselFilter) &&
      (!fuelFilter || r.fuelType === fuelFilter) &&
      (!yearFilter || r.year === Number(yearFilter))
    );
  });

  const fetchRoutes = async () => {
    const res = await axios.get("http://localhost:3000/routes");
    setRoutes(res.data);
  };

  useEffect(() => {
    const load = async () => {
      await fetchRoutes();
    };
    load();
  }, []);

  const setBaseline = async (id: string) => {
    await axios.post(`http://localhost:3000/routes/${id}/baseline`);
    fetchRoutes();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Routes</h2>

      {/* 🔽 FILTERS */}
      <div className="flex gap-4 mb-4">
        <select
          onChange={(e) => setVesselFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Vessel</option>
          <option>Container</option>
          <option>BulkCarrier</option>
          <option>Tanker</option>
          <option>RoRo</option>
        </select>

        <select
          onChange={(e) => setFuelFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Fuel</option>
          <option>HFO</option>
          <option>LNG</option>
          <option>MGO</option>
        </select>

        <select
          onChange={(e) => setYearFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Years</option>
          <option>2024</option>
          <option>2025</option>
        </select>
      </div>

      {/* 📊 TABLE */}
      <table className="w-full border rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th>ID</th>
            <th>Vessel</th>
            <th>Fuel</th>
            <th>Year</th>
            <th>GHG</th>
            <th>Fuel (t)</th>
            <th>Distance (km)</th>
            <th>Emissions (t)</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((r) => (
            <tr
              key={r.routeId}
              className="text-center border-t hover:bg-gray-100 transition"
            >
              <td>{r.routeId}</td>
              <td>{r.vesselType}</td>
              <td>{r.fuelType}</td>
              <td>{r.year}</td>
              <td>{r.ghgIntensity}</td>
              <td>{r.fuelConsumption}</td>
              <td>{r.distance}</td>
              <td>{r.totalEmissions}</td>

              <td>
                <button
                  onClick={() => setBaseline(r.routeId)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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