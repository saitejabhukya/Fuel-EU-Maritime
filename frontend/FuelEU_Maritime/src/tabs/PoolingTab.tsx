import { useState } from "react";
import axios from "axios";

interface PoolMemberInput {
  shipId: string;
  cb: number;
}

interface PoolMemberResult {
  shipId: string;
  cb_after: number;
}

export default function PoolingTab() {
  const [result, setResult] = useState<PoolMemberResult[]>([]);

  const createPool = async () => {
    const members: PoolMemberInput[] = [
      { shipId: "S1", cb: 1000 },
      { shipId: "S2", cb: -500 },
      { shipId: "S3", cb: -300 }
    ];

    const res = await axios.post<PoolMemberResult[]>(
      "http://localhost:3000/pools",
      { members }
    );

    setResult(res.data);
  };

  return (
    <div>
      <button
        onClick={createPool}
        className="bg-purple-500 text-white p-2"
      >
        Create Pool
      </button>

      <table className="border w-full mt-4">
        <thead>
          <tr>
            <th>Ship</th>
            <th>CB After</th>
          </tr>
        </thead>
        <tbody>
          {result.map(r => (
            <tr key={r.shipId}>
              <td>{r.shipId}</td>
              <td>{r.cb_after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}