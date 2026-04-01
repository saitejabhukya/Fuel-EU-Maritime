import { useState } from "react";
import axios from "axios";

export default function PoolingTab() {
  type PoolResult = {
    shipId: string;
    cb_after: number;
  };

  const [data, setData] = useState<PoolResult[]>([]);

  const createPool = async () => {
    const res = await axios.post("http://localhost:3000/pools", {
      members: [
        { shipId: "S1", cb: 1000 },
        { shipId: "S2", cb: -500 },
        { shipId: "S3", cb: -300 }
      ]
    });

    setData(res.data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pooling</h2>

      <button
        onClick={createPool}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Create Pool
      </button>

      <table className="w-full mt-4 border">
        <thead className="bg-gray-200">
          <tr>
            <th>Ship</th>
            <th>CB After</th>
          </tr>
        </thead>

        <tbody>
          {data.map(r => (
            <tr key={r.shipId} className="text-center border-t">
              <td>{r.shipId}</td>
              <td>{r.cb_after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}