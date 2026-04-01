import { useEffect, useState } from "react";
import type { Route } from "../types";
import { routeClient } from "../adapters/infrastructure/apiClient";

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

  const fetchRoutes = () => routeClient.getRoutes().then(setRoutes);

  useEffect(() => { fetchRoutes(); }, []);

  const setBaseline = async (routeId: string) => {
    await routeClient.setBaseline(routeId);
    fetchRoutes();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Routes</h2>

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

      <table className="w-full border rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Vessel</th>
            <th className="p-2">Fuel</th>
            <th className="p-2">Year</th>
            <th className="p-2">GHG (gCO₂e/MJ)</th>
            <th className="p-2">Fuel (t)</th>
            <th className="p-2">Distance (km)</th>
            <th className="p-2">Emissions (t)</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr
              key={r.routeId}
              className={`text-center border-t hover:bg-gray-50 transition ${r.isBaseline ? "bg-blue-50 font-semibold" : ""}`}
            >
              <td className="p-2">
                {r.routeId}
                {r.isBaseline && (
                  <span className="ml-1 text-xs bg-blue-600 text-white px-1 rounded">BASE</span>
                )}
              </td>
              <td className="p-2">{r.vesselType}</td>
              <td className="p-2">{r.fuelType}</td>
              <td className="p-2">{r.year}</td>
              <td className="p-2">{r.ghgIntensity}</td>
              <td className="p-2">{r.fuelConsumption}</td>
              <td className="p-2">{r.distance}</td>
              <td className="p-2">{r.totalEmissions}</td>
              <td className="p-2">
                <button
                  onClick={() => setBaseline(r.routeId)}
                  disabled={r.isBaseline}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-40"
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