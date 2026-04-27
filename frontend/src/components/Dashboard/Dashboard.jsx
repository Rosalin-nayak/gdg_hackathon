import { useEffect, useState } from "react";
import { getIncidents } from "../../api/incidents";

function Dashboard() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    getIncidents()
      .then((res) => {
        console.log("INCIDENTS:", res.data);
        setIncidents(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Incidents</h2>

      {incidents.length === 0 ? (
        <p>No incidents</p>
      ) : (
        incidents.map((item, index) => (
          <div key={index}>{item.title || "No title"}</div>
        ))
      )}
    </div>
  );
}

export default Dashboard;