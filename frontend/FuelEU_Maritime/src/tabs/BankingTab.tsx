import { useState } from "react";
import axios from "axios";
import type { BankKPIs } from "../types";
import { complianceClient, bankingClient } from "../adapters/infrastructure/apiClient";

export default function BankingTab() {
  const [shipId, setShipId] = useState("S1");
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<number | null>(null);
  const [deficit, setDeficit] = useState(0);
  const [applyAmount, setApplyAmount] = useState(0);
  const [kpis, setKpis] = useState<BankKPIs | null>(null);
  const [msg, setMsg] = useState("");

  const getCB = async () => {
    try {
      const data = await complianceClient.getCB(shipId, year);
      setCb(data.cb);
      setMsg("");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) setMsg(e.response?.data?.error || "Error fetching CB");
      else setMsg("Unknown error");
    }
  };

  const bank = async () => {
    if (cb === null || cb <= 0) return;
    try {
      const data = await bankingClient.bank(shipId, cb);
      setMsg(`✅ Banked: ${data.banked.toFixed(2)} gCO₂e`);
      setKpis(null);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) setMsg(e.response?.data?.error || "Banking failed");
      else setMsg("Unknown error");
    }
  };

  const apply = async () => {
    if (applyAmount <= 0) return;
    try {
      const data = await bankingClient.apply(shipId, deficit, applyAmount);
      setKpis(data);
      setMsg(`✅ Applied ${data.applied.toFixed(2)} gCO₂e to deficit`);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) setMsg(e.response?.data?.error || "Apply failed");
      else setMsg("Unknown error");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Banking (Article 20)</h2>

      {/* Ship / Year inputs */}
      <div className="flex gap-3 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Ship ID</label>
          <input
            value={shipId}
            onChange={e => setShipId(e.target.value)}
            className="border p-2 rounded w-28"
          />
        </div>
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
          onClick={getCB}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Get CB
        </button>
      </div>

      {cb !== null && (
        <div className={`p-3 rounded border ${cb > 0 ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
          <span className="font-semibold">Compliance Balance:</span>{" "}
          {cb.toFixed(2)} gCO₂e &nbsp;
          {cb > 0 ? "✅ Surplus" : "❌ Deficit"}
        </div>
      )}

      {/* Bank Surplus */}
      <div className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Bank Surplus</h3>
        <p className="text-sm text-gray-500">Banks the current positive CB for future use.</p>
        <button
          onClick={bank}
          disabled={cb === null || cb <= 0}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-40"
        >
          Bank Surplus
        </button>
      </div>

      {/* Apply Banked */}
      <div className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Apply Banked</h3>
        <p className="text-sm text-gray-500">Apply previously banked credits to a deficit.</p>
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Deficit (negative CB)</label>
            <input
              type="number"
              value={deficit}
              onChange={e => setDeficit(Number(e.target.value))}
              className="border p-2 rounded w-36"
              placeholder="-500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount to apply</label>
            <input
              type="number"
              value={applyAmount}
              onChange={e => setApplyAmount(Number(e.target.value))}
              className="border p-2 rounded w-36"
              min={0}
            />
          </div>
          <button
            onClick={apply}
            disabled={applyAmount <= 0}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-40"
          >
            Apply Banked
          </button>
        </div>
      </div>

      {/* KPIs */}
      {kpis && (
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Result KPIs</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-red-100 p-3 rounded">
              <p className="text-xs text-gray-500">CB Before</p>
              <p className="text-lg font-bold text-red-700">{kpis.cb_before.toFixed(2)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <p className="text-xs text-gray-500">Applied</p>
              <p className="text-lg font-bold text-blue-700">+{kpis.applied.toFixed(2)}</p>
            </div>
            <div className={`p-3 rounded ${kpis.cb_after >= 0 ? "bg-green-100" : "bg-yellow-100"}`}>
              <p className="text-xs text-gray-500">CB After</p>
              <p className={`text-lg font-bold ${kpis.cb_after >= 0 ? "text-green-700" : "text-yellow-700"}`}>
                {kpis.cb_after.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {msg && (
        <p className={`text-sm ${msg.startsWith("✅") ? "text-green-700" : "text-red-600"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}