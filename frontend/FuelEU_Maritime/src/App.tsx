import { useState } from "react";
import RoutesTab from "./tabs/RoutesTab";
import CompareTab from "./tabs/CompareTab";
import BankingTab from "./tabs/BankingTab";
import PoolingTab from "./tabs/PoolingTab";

const TAB_CONFIG = [
  { id: "routes", label: "Routes", icon: "⚓" },
  { id: "compare", label: "Compare", icon: "📊" },
  { id: "banking", label: "Banking", icon: "🏦" },
  { id: "pooling", label: "Pooling", icon: "🔗" },
];

export default function App() {
  const [tab, setTab] = useState("routes");
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return (
    <div className={`theme-wrapper ${theme}`}>
      <style>{`
        @import url('[https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap)');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .theme-wrapper {
          /* --- Global Fonts --- */
          --font-display: 'Inter', system-ui, sans-serif;
          --font-body: 'Inter', system-ui, sans-serif;
          --font-mono: 'Roboto Mono', monospace;
          --radius: 10px;

          /* --- Core Color Palettes --- */
          --amber: #f59e0b;
          --cyan: #0ea5e9;
          --emerald: #10b981;
          --rose: #ef4444;

          font-family: var(--font-body);
          background: var(--bg);
          color: var(--text-primary);
          min-height: 100vh;
          transition: background 0.3s ease, color 0.3s ease;
        }

        /* ─── DARK THEME ────────────────────────────── */
        .theme-wrapper.dark {
          --bg: #05090f;
          --surface: #080e1a;
          --card: #0c1522;
          --card-hover: #111e2e;
          --border: #1e293b;
          --border-bright: #334155;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          --grid-line: rgba(255, 255, 255, 0.03);

          --amber-dim: rgba(245,158,11,0.12);
          --amber-glow: rgba(245,158,11,0.28);
          --cyan-dim: rgba(14,165,233,0.12);
          --emerald-dim: rgba(16,185,129,0.12);
          --rose-dim: rgba(239,68,68,0.12);
        }

        /* ─── LIGHT THEME ───────────────────────────── */
        .theme-wrapper.light {
          --bg: #f1f5f9;
          --surface: #ffffff;
          --card: #ffffff;
          --card-hover: #f8fafc;
          --border: #cbd5e1;
          --border-bright: #94a3b8;
          --text-primary: #0f172a;
          --text-secondary: #334155;
          --text-muted: #475569;
          --grid-line: rgba(0, 0, 0, 0.04);

          --amber: #d97706; /* Darker amber for light mode contrast */
          --cyan: #0284c7;
          --emerald: #059669;
          --rose: #dc2626;

          --amber-dim: rgba(217,119,6,0.1);
          --amber-glow: rgba(217,119,6,0.15);
          --cyan-dim: rgba(2,132,199,0.1);
          --emerald-dim: rgba(5,150,105,0.1);
          --rose-dim: rgba(220,38,38,0.1);
        }

        /* ─── Scrollbar & Utilities ─────────────────── */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--surface); }
        ::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 3px; }

        .dash-bg {
          min-height: 100vh;
          padding: 36px 40px 60px;
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 48px 48px;
          background-position: center;
        }

        /* ─── UI Components ─────────────────────────── */
        .tab-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 22px; background: var(--surface);
          border: 1px solid var(--border); border-radius: 6px;
          color: var(--text-secondary); font-family: var(--font-display);
          font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s;
        }
        .tab-btn:hover { background: var(--card-hover); color: var(--text-primary); border-color: var(--border-bright); }
        .tab-btn.active {
          background: var(--amber-dim); border-color: var(--amber);
          color: var(--amber); box-shadow: 0 0 12px var(--amber-glow);
        }

        .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; transition: border-color 0.2s, box-shadow 0.2s; }
        .theme-wrapper.light .card { box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .card:hover { border-color: var(--border-bright); }

        .input-field, .select-field {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 6px; color: var(--text-primary); font-family: var(--font-mono);
          font-size: 13px; padding: 8px 12px; outline: none; display: block;
        }
        .select-field { font-family: var(--font-body); padding-right: 36px; cursor: pointer; appearance: none; }
        .input-field:focus, .select-field:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px var(--cyan-dim); }

        .btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-display); font-weight: 600; font-size: 13px;
          padding: 10px 20px; border-radius: 6px; cursor: pointer;
          border: none; white-space: nowrap; transition: 0.2s;
        }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-amber { background: var(--amber); color: #fff; }
        .theme-wrapper.dark .btn-amber { color: #000; }
        .btn-amber:not(:disabled):hover { filter: brightness(1.1); box-shadow: 0 4px 12px var(--amber-glow); }

        .btn-cyan { background: transparent; border: 1px solid var(--cyan); color: var(--cyan); }
        .btn-cyan:not(:disabled):hover { background: var(--cyan-dim); }
        .btn-emerald { background: transparent; border: 1px solid var(--emerald); color: var(--emerald); }
        .btn-emerald:not(:disabled):hover { background: var(--emerald-dim); }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th {
          background: var(--surface); color: var(--text-muted);
          font-family: var(--font-display); font-size: 11px; font-weight: 600;
          text-transform: uppercase; padding: 13px 16px; text-align: left;
          border-bottom: 1px solid var(--border); letter-spacing: 0.05em;
        }
        .data-table td {
          padding: 12px 16px; border-bottom: 1px solid var(--border);
          color: var(--text-primary); font-family: var(--font-mono); font-size: 13px;
        }
        .data-table tbody tr:hover td { background: var(--card-hover); }
        .data-table tbody tr.baseline td { background: var(--amber-dim); }

        .badge {
          display: inline-block; padding: 3px 8px; border-radius: 4px;
          font-family: var(--font-display); font-size: 11px; font-weight: 600;
        }
        .badge-amber { background: var(--amber-dim); color: var(--amber); }
        .badge-cyan { background: var(--cyan-dim); color: var(--cyan); }
        .badge-emerald { background: var(--emerald-dim); color: var(--emerald); }
        .badge-rose { background: var(--rose-dim); color: var(--rose); }
        .badge-muted { background: var(--surface); color: var(--text-secondary); border: 1px solid var(--border); }

        .status-bar { border-radius: 8px; padding: 14px 20px; font-family: var(--font-mono); font-size: 14px; display: flex; align-items: center; gap: 12px; }
        .status-bar.success { background: var(--emerald-dim); border: 1px solid var(--emerald); color: var(--emerald); }
        .status-bar.danger { background: var(--rose-dim); border: 1px solid var(--rose); color: var(--rose); }

        .kpi-card { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 20px 24px; text-align: center; }
        .kpi-label { font-family: var(--font-display); font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; }
        .kpi-value { font-family: var(--font-mono); font-size: 26px; font-weight: 700; line-height: 1; }
        .kpi-unit { font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 6px; }

        .section-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 12px; }
        .section-title::after { content: ''; height: 1px; flex: 1; background: linear-gradient(to right, var(--border), transparent); }
        .label { font-family: var(--font-display); font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px; }
        .panel-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .panel-title { font-family: var(--font-display); font-weight: 600; font-size: 15px; color: var(--text-primary); }

        .msg-success, .msg-error { font-family: var(--font-mono); font-size: 13px; padding: 11px 16px; border-radius: 6px; font-weight: 500;}
        .msg-success { color: var(--emerald); background: var(--emerald-dim); border: 1px solid var(--emerald); }
        .msg-error { color: var(--rose); background: var(--rose-dim); border: 1px solid var(--rose); }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; display: inline-block; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease; }
      `}</style>

      <div className="dash-bg">
        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 44 }}>
          <div style={{
            width: 50, height: 50, background: 'var(--amber)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            boxShadow: '0 4px 16px var(--amber-glow)'
          }}>🚢</div>

          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              FuelEU Dashboard
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 5 }}>
              Maritime Compliance Monitor
            </p>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 12px',
                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600
              }}
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'var(--emerald-dim)',
              border: '1px solid var(--emerald)', borderRadius: 8, padding: '7px 16px'
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--emerald)', letterSpacing: '0.1em' }}>LIVE</span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto' }}>
          {TAB_CONFIG.map(t => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ── Content Panel ── */}
        <div className="card fade-up" style={{ padding: 32 }}>
          {tab === "routes" && <RoutesTab />}
          {tab === "compare" && <CompareTab />}
          {tab === "banking" && <BankingTab />}
          {tab === "pooling" && <PoolingTab />}
        </div>
      </div>
    </div>
  );
}