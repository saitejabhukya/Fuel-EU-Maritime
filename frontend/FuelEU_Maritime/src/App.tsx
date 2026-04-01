import { useState } from "react";
import RoutesTab from "./tabs/RoutesTab";
import CompareTab from "./tabs/CompareTab";
import BankingTab from "./tabs/BankingTab";
import PoolingTab from "./tabs/PoolingTab";

export default function App() {
  const [tab, setTab] = useState("routes");

  const tabs = ["routes", "compare", "banking", "pooling"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        🚢 Fuel EU Dashboard
      </h1>

      <div className="flex gap-3 mb-6">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-gray-200"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        {tab === "routes" && <RoutesTab />}
        {tab === "compare" && <CompareTab />}
        {tab === "banking" && <BankingTab />}
        {tab === "pooling" && <PoolingTab />}
      </div>
    </div>
  );
}