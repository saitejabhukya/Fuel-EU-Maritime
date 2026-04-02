import { useEffect, useState } from "react";
import type { Route } from "../types"; // Adjust path as needed
import { routeClient } from "../adapters/infrastructure/apiClient"; // Adjust path as needed

const FUEL_COLORS: Record<string, string> = {
  LNG: 'var(--cyan)',
  HFO: 'var(--rose)',
  MGO: 'var(--amber)',
};

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vesselFilter, setVesselFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const filtered = routes
  .filter(r =>
    (!vesselFilter || r.vesselType === vesselFilter) &&
    (!fuelFilter || r.fuelType === fuelFilter) &&
    (!yearFilter || r.year === Number(yearFilter))
  )
  .sort((a, b) => a.routeId.localeCompare(b.routeId));

  const fetchRoutes = () => routeClient.getRoutes().then(setRoutes);
  useEffect(() => { fetchRoutes(); }, []);

  const setBaseline = async (routeId: string) => {
    await routeClient.setBaseline(routeId);
    fetchRoutes();
  };

  const hasFilters = !!(vesselFilter || fuelFilter || yearFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="section-title" style={{ flex: 1 }}>Routes</div>
        <span className="badge badge-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '4px 12px' }}>
          {filtered.length} / {routes.length}
        </span>
      </div>

      <div className="card" style={{ padding: '18px 22px' }}>
        <label className="label" style={{ marginBottom: 14 }}>Filter Routes</label>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label className="label">Vessel Type</label>
            <select onChange={e => setVesselFilter(e.target.value)} value={vesselFilter} className="select-field">
              <option value="">All Vessels</option>
              <option>Container</option>
              <option>BulkCarrier</option>
              <option>Tanker</option>
              <option>RoRo</option>
            </select>
          </div>
          <div>
            <label className="label">Fuel Type</label>
            <select onChange={e => setFuelFilter(e.target.value)} value={fuelFilter} className="select-field">
              <option value="">All Fuels</option>
              <option>HFO</option>
              <option>LNG</option>
              <option>MGO</option>
            </select>
          </div>
          <div>
            <label className="label">Year</label>
            <select onChange={e => setYearFilter(e.target.value)} value={yearFilter} className="select-field">
              <option value="">All Years</option>
              <option>2024</option>
              <option>2025</option>
            </select>
          </div>
          {hasFilters && (
            <button
              className="btn btn-cyan"
              style={{ padding: '8px 16px', fontSize: 11 }}
              onClick={() => { setVesselFilter(""); setFuelFilter(""); setYearFilter(""); }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-header">
          <span className="panel-title">Route Fleet</span>
          <span style={{ display: 'flex', gap: 8 }}>
            {Object.entries(FUEL_COLORS).map(([fuel, color]) => (
              <span key={fuel} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{fuel}</span>
              </span>
            ))}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 920 }}>
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Vessel</th>
                <th>Fuel</th>
                <th style={{ textAlign: 'center' }}>Year</th>
                <th style={{ textAlign: 'right' }}>GHG (gCO₂e/MJ)</th>
                <th style={{ textAlign: 'right' }}>Fuel (t)</th>
                <th style={{ textAlign: 'right' }}>Distance (km)</th>
                <th style={{ textAlign: 'right' }}>Emissions (t)</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.routeId} className={r.isBaseline ? 'baseline' : ''}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, color: 'var(--cyan)' }}>{r.routeId}</span>
                      {r.isBaseline && <span className="badge badge-amber">Base</span>}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block', background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 4, padding: '2px 8px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)'
                    }}>
                      {r.vesselType}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: FUEL_COLORS[r.fuelType] ?? 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {r.fuelType}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{r.year}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-primary)', fontWeight: 600 }}>{r.ghgIntensity}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{r.fuelConsumption}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{r.distance}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{r.totalEmissions}</td>
                  <td style={{ textAlign: 'center' }}>
                    {r.isBaseline ? (
                      <span className="badge badge-amber" style={{ padding: '5px 12px', fontSize: 11 }}>Active</span>
                    ) : (
                      <button onClick={() => setBaseline(r.routeId)} className="btn btn-emerald" style={{ padding: '6px 14px', fontSize: 11 }}>
                        Set Baseline
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: 14 }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>⛵</div>
                    No routes match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}