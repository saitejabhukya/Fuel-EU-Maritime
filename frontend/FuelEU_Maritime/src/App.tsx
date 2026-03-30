import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [routes, setRoutes] = useState([]);
// This effect runs once when the component mounts and fetches route data from the backend API, updating the state with the retrieved routes.
  useEffect(() => {
    axios.get("http://localhost:3000/routes")
      .then(res => setRoutes(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Routes</h1>

      <table className="table-auto border">
        <thead>
          <tr>
            <th>ID</th>
            <th>GHG</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r: any) => (
            <tr key={r.routeId}>
              <td>{r.routeId}</td>
              <td>{r.ghgIntensity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;