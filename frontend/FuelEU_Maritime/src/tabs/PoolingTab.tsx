import { useState } from "react";
import axios from "axios";
import type { PoolMember } from "../types";
import { complianceClient, poolingClient } from "../adapters/infrastructure/apiClient";
import { computePoolSum, isPoolValid } from "../core/application/compliance";

const DEFAULT_SHIP_IDS = ["S1", "S2", "S3"];
type MemberInput = { shipId: string; cb: number; loaded: boolean };

export default function PoolingTab() {
  const [year, setYear] = useState(2024);
  const [loadingCBs, setLoadingCBs] = useState(false);
  const [msg, setMsg] = useState("");
  const [result, setResult] = useState<PoolMember[]>([]);
  const [members, setMembers] = useState<MemberInput[]>(
    DEFAULT_SHIP_IDS.map(id => ({ shipId: id, cb: 0, loaded: false }))
  );

  const fetchAdjustedCBs = async () => {
    setLoadingCBs(true);
    setMsg("");
    const updated = await Promise.all(
      members.map(async m => {
        try {
          const data = await complianceClient.getAdjustedCB(m.shipId, year);
          return { ...m, cb: data.adjustedCB, loaded: true };
        } catch {
          return { ...m, cb: 0, loaded: false };
        }
      })
    );
    setMembers(updated);
    setLoadingCBs(false);
  };

  const updateMemberCB = (shipId: string, cb: number) => 
    setMembers(prev => prev.map(m => m.shipId === shipId ? { ...m, cb } : m));

  const poolSum = computePoolSum(members);
  const valid = isPoolValid(members);

  const createPool = async () => {
    try {
      const data = await poolingClient.createPool(members.map(m => ({ shipId: m.shipId, cb: m.cb })));
      setResult(data);
      setMsg("Pool created successfully");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setMsg(e.response?.data?.error || "Error");
      } else {
        setMsg("Unknown error");
      }
    }
  };

  const isSuccess = msg.includes("successfully");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="section-title" style={{ flex: 1 }}>Pooling</div>
        <span className="badge badge-cyan">Article 21</span>
      </div>

      <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div>
          <label className="label">Compliance Year</label>
          <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="input-field" style={{ width: 120 }} />
        </div>
        <button onClick={fetchAdjustedCBs} disabled={loadingCBs} className="btn btn-cyan">
          {loadingCBs ? <><span className="spin">↻</span> Loading…</> : 'Fetch Adjusted CBs'}
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-header">
          <span className="panel-title">Pool Members</span>
          <span className="badge badge-amber">{members.length} vessels</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 500 }}>
            <thead>
              <tr>
                <th>Ship ID</th>
                <th>Data Source</th>
                <th style={{ textAlign: 'right' }}>Adjusted CB (gCO₂e)</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.shipId}>
                  <td><span style={{ fontWeight: 600, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{m.shipId}</span></td>
                  <td>{m.loaded ? <span className="badge badge-emerald">Auto-loaded</span> : <span className="badge badge-muted">Manual</span>}</td>
                  <td style={{ textAlign: 'right' }}>
                    <input type="number" value={m.cb} onChange={e => updateMemberCB(m.shipId, Number(e.target.value))} className="input-field" style={{ width: 150, textAlign: 'right', display: 'inline-block' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', flexWrap: 'wrap' }}>
        <div className={`status-bar ${valid ? 'success' : 'danger'}`} style={{ flex: 1, minWidth: 250 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{valid ? '✓' : '✕'}</span>
          <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Pool Sum {valid ? '— Valid' : '— Invalid (sum < 0)'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600 }}>{poolSum.toFixed(2)}</span>
          <span style={{ fontSize: 11, opacity: 0.6 }}>gCO₂e</span>
        </div>
        <button onClick={createPool} disabled={!valid} className="btn btn-amber" style={{ flex: '0 1 auto', padding: '0 28px' }}>
          Create Pool
        </button>
      </div>

      {msg && <div className={`fade-up ${isSuccess ? 'msg-success' : 'msg-error'}`}>{isSuccess ? '✓ ' : '✕ '}{msg}</div>}

      {result.length > 0 && (
        <div className="card fade-up" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="panel-header">
            <span className="panel-title">Pool Allocation Result</span>
            <span className="badge badge-emerald">Settled</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vessel</th>
                  <th style={{ textAlign: 'right' }}>CB Before (gCO₂e)</th>
                  <th style={{ textAlign: 'right' }}>CB After (gCO₂e)</th>
                  <th style={{ textAlign: 'center' }}>Net Change</th>
                </tr>
              </thead>
              <tbody>
                {result.map(r => {
                  const delta = r.cb_after - r.cb_before;
                  return (
                    <tr key={r.shipId}>
                      <td><span style={{ fontWeight: 600, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{r.shipId}</span></td>
                      <td style={{ textAlign: 'right', color: r.cb_before < 0 ? 'var(--rose)' : 'var(--emerald)' }}>{r.cb_before.toFixed(2)}</td>
                      <td style={{ textAlign: 'right', color: r.cb_after < 0 ? 'var(--rose)' : 'var(--emerald)' }}>{r.cb_after.toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${delta > 0 ? 'badge-emerald' : delta < 0 ? 'badge-rose' : 'badge-muted'}`}>
                          {delta >= 0 ? '+' : ''}{delta.toFixed(0)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
