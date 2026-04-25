import { useContext } from "react";
import { AppContext } from "../../store/AppContext";

function AlertFeed() {
  const { alerts } = useContext(AppContext);

  return (
    <div>
      <div className="title">Live Alerts</div>

      {alerts.map((a, i) => (
        <div key={i} style={{
          background: "#1a2f4e",
          padding: "6px",
          marginBottom: "5px",
          borderLeft: "3px solid red"
        }}>
          {a.text} ({a.location}) - {a.time}
        </div>
      ))}
    </div>
  );
}

export default AlertFeed;