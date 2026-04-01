import { useState } from "react";
import axios from "axios";

export default function BankingTab() {
  const [cb, setCb] = useState(0);
  const [message, setMessage] = useState("");

  const fetchCB = async () => {
    const res = await axios.get("http://localhost:3000/compliance/cb");
    setCb(res.data.cb);
  };

  const bank = async () => {
    try {
      const res = await axios.post("http://localhost:3000/banking/bank", {
        shipId: "S1",
        cb
      });
      setMessage(`Banked: ${res.data.banked}`);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        setMessage(e.response.data.error);
      } else {
        setMessage("An error occurred");
      }
    }
  };

  return (
    <div>
      <button onClick={fetchCB} className="bg-blue-500 text-white p-2">
        Get CB
      </button>

      <p>CB: {cb}</p>

      <button
        onClick={bank}
        disabled={cb <= 0}
        className="bg-green-500 text-white p-2"
      >
        Bank
      </button>

      <p>{message}</p>
    </div>
  );
}