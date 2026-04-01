import { useState } from "react";
import RoutesTab from "./tabs/RoutesTab";
import CompareTab from "./tabs/CompareTab";
import BankingTab from "./tabs/BankingTab";
import PoolingTab from "./tabs/PoolingTab";

function App() {
  const [activeTab, setActiveTab] = useState("routes");

  const renderTab = () => {
    switch (activeTab) {
      case "routes":
        return <RoutesTab />;
      case "compare":
        return <CompareTab />;
      case "banking":
        return <BankingTab />;
      case "pooling":
        return <PoolingTab />;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fuel EU Dashboard</h1>

      <div className="flex gap-4 mb-4">
        {["routes", "compare", "banking", "pooling"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border rounded ${
              activeTab === tab ? "bg-blue-500 text-white" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}

export default App;