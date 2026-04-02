import { useEffect, useState } from "react";
import type { Comparison } from "../types";
import { routeClient } from "../adapters/infrastructure/apiClient";
import { TARGET_GHG_INTENSITY } from "../shared/constants";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ReferenceLine, Cell, ResponsiveContainer
} from "recharts";

interface TooltipPayloadEntry {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const compliant = val <= TARGET_GHG_INTENSITY;
  return (
    <div style={{
      background: 'var(--card)', border: `1px solid ${compliant ? 'var(--emerald)' : 'var(--rose)'}`,
      borderRadius: 8, padding: '12px 16px', boxShadow: `0 8px 32px rgba(0,0,0,0.1)`
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: compliant ? 'var(--emerald)' : 'var(--rose)', marginBottom: 4 }}>
        {val} <span style={{ fontSize: 11, opacity: 0.65 }}>gCO₂e/MJ</span>
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: compliant ? 'var(--emerald)' : 'var(--rose)', opacity: 0.85 }}>
        {compliant ? '✓ Compliant' : '✕ Non-compliant'}
      </p>
    </div>
  );
};

export default function CompareTab() {
  const [data1, setData] = useState<Comparison[]>([]);
  const data = [...data1].sort((a, b) =>
    a.routeId.localeCompare(b.routeId)
  );

  useEffect(() => { routeClient.getComparison().then(setData); }, []);

  const compliantCount = data.filter(d => d.compliant).length;
  const complianceRate = data.length ? Math.round(compliantCount / data.length * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="section-title">GHG Comparison</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="kpi-card" style={{ borderColor: 'rgba(245,158,11,0.25)' }}>
          <div className="kpi-label">FuelEU Target</div>
          <div className="kpi-value" style={{ color: 'var(--amber)', fontSize: 28 }}>{TARGET_GHG_INTENSITY}</div>
          <div className="kpi-unit">gCO₂e / MJ</div>
        </div>
        <div className="kpi-card" style={{ borderColor: compliantCount > 0 ? 'rgba(16,185,129,0.25)' : 'var(--border)' }}>
          <div className="kpi-label">Compliant Routes</div>
          <div className="kpi-value" style={{ color: 'var(--emerald)', fontSize: 28 }}>
            {compliantCount} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/ {data.length}</span>
          </div>
          <div className="kpi-unit">routes passing</div>
        </div>
        <div className="kpi-card" style={{ borderColor: complianceRate >= 50 ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)' }}>
          <div className="kpi-label">Compliance Rate</div>
          <div className="kpi-value" style={{ color: complianceRate >= 50 ? 'var(--emerald)' : 'var(--rose)', fontSize: 28 }}>
            {complianceRate}%
          </div>
          <div className="kpi-unit">of fleet</div>
        </div>
      </div>

      <div className="card">
        <p className="label" style={{ marginBottom: 24 }}>GHG Intensity Distribution</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barCategoryGap="35%" margin={{ top: 8, right: 60, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="2 5" stroke="var(--border-bright)" vertical={false} />
            <XAxis dataKey="routeId" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis domain={[85, 96]} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface)' }} />
            <ReferenceLine y={TARGET_GHG_INTENSITY} stroke="var(--amber)" strokeDasharray="5 4" strokeWidth={1.5}
              label={{ value: `Target ${TARGET_GHG_INTENSITY}`, position: 'right', fill: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)' }} />
            <Bar dataKey="ghgIntensity" name="GHG Intensity (gCO₂e/MJ)" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.compliant ? 'var(--emerald)' : 'var(--rose)'} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 16 }}>
          {[
            { color: 'var(--emerald)', label: 'Compliant' },
            { color: 'var(--rose)', label: 'Non-compliant' },
            { color: 'var(--amber)', label: 'Target threshold', dashed: true },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {item.dashed ? <div style={{ width: 18, borderBottom: `2px dashed ${item.color}` }} /> : <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />}
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-header">
          <span className="panel-title">Route Analysis</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{data.length} routes</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 600 }}>
            <thead>
              <tr>
                <th>Route ID</th>
                <th style={{ textAlign: 'right' }}>GHG Intensity (gCO₂e/MJ)</th>
                <th style={{ textAlign: 'right' }}>Δ vs Baseline</th>
                <th style={{ textAlign: 'center' }}>Compliance</th>
              </tr>
            </thead>
            <tbody>
              {data.map(r => (
                <tr key={r.routeId} className={r.isBaseline ? 'baseline' : ''}>
                  <td>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{r.routeId}</span>
                    {r.isBaseline && <span className="badge badge-amber" style={{ marginLeft: 10 }}>Baseline</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>{r.ghgIntensity}</td>
                  <td style={{ textAlign: 'right', color: r.isBaseline ? 'var(--text-muted)' : r.percentDiff <= 0 ? 'var(--emerald)' : 'var(--rose)' }}>
                    {r.isBaseline ? '—' : `${r.percentDiff >= 0 ? '+' : ''}${r.percentDiff.toFixed(2)}%`}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${r.compliant ? 'badge-emerald' : 'badge-rose'}`}>
                      {r.compliant ? 'Compliant' : 'Non-compliant'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
