import { useState } from "react";
import axios from "axios";
import type { BankKPIs } from "../types";
import { complianceClient, bankingClient } from "../adapters/infrastructure/apiClient";

export default function BankingTab() {
  const [shipId, setShipId] = useState("S1");
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<number | null>(null);
  const [deficit, setDeficit] = useState(-5000);
  const [applyAmount, setApplyAmount] = useState(0);
  const [kpis, setKpis] = useState<BankKPIs | null>(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const getCB = async () => {
    setLoading(true);
    try {
      const data = await complianceClient.getCB(shipId, year);
      setCb(data.cb);
      setMsg("");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setMsg(e.response?.data?.error || "Error fetching CB");
      } else {
        setMsg("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const bank = async () => {
    if (cb === null || cb <= 0) return;
    try {
      const data = await bankingClient.bank(shipId, cb);
      setMsg(`Banked ${data.banked.toFixed(2)} gCO₂e successfully`);
      setKpis(null);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setMsg(e.response?.data?.error || "Banking failed");
      } else {
        setMsg("Unknown error");
      }
    }
  };

  const apply = async () => {
    if (applyAmount <= 0) return;
    try {
      const data = await bankingClient.apply(shipId, deficit, applyAmount);
      setKpis(data);
      setMsg(`Applied ${data.applied.toFixed(2)} gCO₂e to deficit`);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setMsg(e.response?.data?.error || "Apply failed");
      } else {
        setMsg("Unknown error");
      }
    }
  };

  const isSuccess = msg && (msg.startsWith("Banked") || msg.startsWith("Applied"));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="section-title" style={{ flex: 1 }}>Banking</div>
        <span className="badge badge-cyan">Article 20</span>
      </div>

      <div className="card">
        <label className="label" style={{ marginBottom: 16 }}>Compliance Balance Lookup</label>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label className="label">Ship ID</label>
            <input value={shipId} onChange={e => setShipId(e.target.value)} className="input-field" style={{ width: 120 }} />
          </div>
          <div>
            <label className="label">Year</label>
            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="input-field" style={{ width: 110 }} />
          </div>
          <button onClick={getCB} disabled={loading} className="btn btn-cyan">
            {loading ? <span className="spin">↻</span> : null} {loading ? 'Querying…' : 'Query CB'}
          </button>
        </div>

        {cb !== null && (
          <div className={`status-bar fade-up ${cb > 0 ? 'success' : 'danger'}`} style={{ marginTop: 18 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{cb > 0 ? '▲' : '▼'}</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Compliance Balance</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600 }}>{cb.toFixed(2)}</span>
            <span style={{ fontSize: 11, opacity: 0.6 }}>gCO₂e</span>
            <span className={`badge ${cb > 0 ? 'badge-emerald' : 'badge-rose'}`}>{cb > 0 ? 'Surplus' : 'Deficit'}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 4 }}>Bank Surplus</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>Lock a positive balance as credit for future periods.</p>
            </div>
            <span style={{ fontSize: 28, marginLeft: 12 }}>💰</span>
          </div>
          {cb !== null && cb > 0 && (
            <div style={{ background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--amber)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Available</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--amber)', fontWeight: 600 }}>{cb.toFixed(2)} <span style={{ fontSize: 11, opacity: 0.7 }}>gCO₂e</span></span>
            </div>
          )}
          <button onClick={bank} disabled={cb === null || cb <= 0} className="btn btn-amber" style={{ marginTop: 'auto', justifyContent: 'center' }}>Bank Surplus</button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 4 }}>Apply Banked</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>Draw from stored credits to offset a deficit.</p>
            </div>
            <span style={{ fontSize: 28, marginLeft: 12 }}>🔄</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label className="label">Deficit (CB)</label>
              <input type="number" value={deficit} onChange={e => setDeficit(Number(e.target.value))} className="input-field" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label className="label">Amount to Apply</label>
              <input type="number" value={applyAmount} onChange={e => setApplyAmount(Number(e.target.value))} className="input-field" style={{ width: '100%' }} min={0} />
            </div>
          </div>
          <button onClick={apply} disabled={applyAmount <= 0} className="btn btn-emerald" style={{ marginTop: 'auto', justifyContent: 'center' }}>Apply Banked</button>
        </div>
      </div>

      {kpis && (
        <div className="card fade-up">
          <label className="label" style={{ marginBottom: 18 }}>Transaction Result</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
            <div className="kpi-card" style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
              <div className="kpi-label">CB Before</div>
              <div className="kpi-value" style={{ color: 'var(--rose)' }}>{kpis.cb_before.toFixed(2)}</div>
              <div className="kpi-unit">gCO₂e</div>
            </div>
            <div className="kpi-card" style={{ borderColor: 'rgba(34,211,238,0.3)', background: 'var(--cyan-dim)' }}>
              <div className="kpi-label">Applied</div>
              <div className="kpi-value" style={{ color: 'var(--cyan)' }}>+{kpis.applied.toFixed(2)}</div>
              <div className="kpi-unit">gCO₂e</div>
            </div>
            <div className="kpi-card" style={{ borderColor: kpis.cb_after >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)' }}>
              <div className="kpi-label">CB After</div>
              <div className="kpi-value" style={{ color: kpis.cb_after >= 0 ? 'var(--emerald)' : 'var(--amber)' }}>{kpis.cb_after.toFixed(2)}</div>
              <div className="kpi-unit">gCO₂e</div>
            </div>
          </div>
        </div>
      )}

      {msg && <div className={`fade-up ${isSuccess ? 'msg-success' : 'msg-error'}`}>{isSuccess ? '✓ ' : '✕ '}{msg}</div>}
    </div>
  );
}
