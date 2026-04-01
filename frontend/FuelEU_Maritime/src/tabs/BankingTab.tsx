import { useState } from "react";
import axios from "axios";

export default function BankingTab() {
  const [cb, setCb] = useState(0);
  const [msg, setMsg] = useState("");

  const getCB = async () => {
    const res = await axios.get(
      "http://localhost:3000/compliance/cb?shipId=S1&year=2024"
    );

    setCb(res.data[0]?.cb || 0);
  };

  const bank = async () => {
    try {
      const res = await axios.post("http://localhost:3000/banking/bank", {
        shipId: "S1",
        cb
      });
      setMsg(`Banked: ${res.data.banked}`);
    } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      setMsg(e.response?.data?.error || "Error");
    } else {
      setMsg("Unknown error");
    }
  }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Banking</h2>

      <button
        onClick={getCB}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get CB
      </button>

      <p className="mt-2">CB: {cb}</p>

      <button
        onClick={bank}
        disabled={cb <= 0}
        className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
      >
        Bank
      </button>

      <p className="mt-2 text-sm">{msg}</p>
    </div>
  );
}