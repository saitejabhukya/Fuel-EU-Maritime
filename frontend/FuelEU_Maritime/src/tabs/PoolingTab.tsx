import { useState } from "react";
import axios from "axios";
import type { PoolMember } from "../types";
import { complianceClient, poolingClient } from "../adapters/infrastructure/apiClient";
import { computePoolSum, isPoolValid } from "../core/application/compliance";

const DEFAULT_SHIP_IDS = ["S1", "S2", "S3"];

type MemberInput = { shipId: string; cb: number; loaded: boolean };

export default function PoolingTab() {
  const [year, setYear] = useState(2024);
  const [members, setMembers] = useState<MemberInput[]>(
    DEFAULT_SHIP_IDS.map(id => ({ shipId: id, cb: 0, loaded: false }))
  );
  const [result, setResult] = useState<PoolMember[]>([]);
  const [loadingCBs, setLoadingCBs] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchAdjustedCBs = async () => {
    setLoadingCBs(true);
    setMsg("");
    const updated = await Promise.all(
      members.map(async (m) => {
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

  const updateMemberCB = (shipId: string, cb: number) => {
    setMembers(prev => prev.map(m => m.shipId === shipId ? { ...m, cb } : m));
  };

  const poolSum = computePoolSum(members);
  const valid = isPoolValid(members);

  const createPool = async () => {
    try {
      const data = await poolingClient.createPool(
        members.map(m => ({ shipId: m.shipId, cb: m.cb }))
      );
      setResult(data);
      setMsg("✅ Pool created successfully");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) setMsg(e.response?.data?.error || "Pool creation failed");
      else setMsg("Unknown error");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Pooling (Article 21)</h2>

      {/* Year + Fetch */}
      <div className="flex gap-3 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="border p-2 rounded w-24"
          />
        </div>
        <button
          onClick={fetchAdjustedCBs}
          disabled={loadingCBs}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loadingCBs ? "Loading…" : "Fetch Adjusted CBs"}
        </button>
      </div>

      {/* Members table */}
      <table className="w-full border rounded shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Ship ID</th>
            <th className="p-2">Adjusted CB (gCO₂e)</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.shipId} className="text-center border-t">
              <td className="p-2">{m.shipId}</td>
              <td className="p-2">
                <input
                  type="number"
                  value={m.cb}
                  onChange={e => updateMemberCB(m.shipId, Number(e.target.value))}
                  className="border rounded p-1 w-36 text-center"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pool Sum indicator */}
      <div className={`p-3 rounded border font-semibold ${valid ? "bg-green-50 border-green-400 text-green-800" : "bg-red-50 border-red-400 text-red-800"}`}>
        Pool Sum: {poolSum.toFixed(2)} gCO₂e &nbsp;
        {valid ? "✅ Valid (sum ≥ 0)" : "❌ Invalid (sum < 0 — cannot create pool)"}
      </div>

      <button
        onClick={createPool}
        disabled={!valid}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-40"
      >
        Create Pool
      </button>

      {msg && (
        <p className={`text-sm ${msg.startsWith("✅") ? "text-green-700" : "text-red-600"}`}>
          {msg}
        </p>
      )}

      {/* Results table */}
      {result.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Pool Allocation Result</h3>
          <table className="w-full border rounded shadow-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Ship</th>
                <th className="p-2">CB Before (gCO₂e)</th>
                <th className="p-2">CB After (gCO₂e)</th>
              </tr>
            </thead>
            <tbody>
              {result.map(r => (
                <tr key={r.shipId} className="text-center border-t">
                  <td className="p-2">{r.shipId}</td>
                  <td className={`p-2 ${r.cb_before < 0 ? "text-red-600" : "text-green-700"}`}>
                    {r.cb_before.toFixed(2)}
                  </td>
                  <td className={`p-2 ${r.cb_after < 0 ? "text-red-600" : "text-green-700"}`}>
                    {r.cb_after.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}