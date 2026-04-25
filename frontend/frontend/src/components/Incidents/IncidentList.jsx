import { useContext } from "react";
import { AppContext } from "../../store/AppContext";

function IncidentList() {
  const { alerts } = useContext(AppContext);

  return (
    <div>
      <div className="panel-title" style={{ marginBottom: "6px" }}>Live Alert Feed</div>
      <div className="alert-feed">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert, idx) => (
            <div key={idx} className={`alert-item ${(alert.text || "").includes("Violence") || (alert.text || "").includes("SOS") ? "high" : "med"}`}>
              <div className={`alert-dot ${(alert.text || "").includes("Violence") || (alert.text || "").includes("SOS") ? "high" : "med"}`}></div>
              <div className="alert-text">
                <div className="alert-title">{alert.text} — {alert.location}</div>
                <div className="alert-meta">Detected at {alert.time}</div>
              </div>
              <div className="alert-time">Now</div>
            </div>
          ))
        ) : (
          <>
            <div className="alert-item high">
              <div className="alert-dot high"></div>
              <div className="alert-text">
                <div className="alert-title">Chasing detected — CAM-01 Lobby</div>
                <div className="alert-meta">Violence model · 87% confidence · Unit Alpha dispatched</div>
              </div>
              <div className="alert-time">0:12</div>
            </div>
            <div className="alert-item med">
              <div className="alert-dot med"></div>
              <div className="alert-text">
                <div className="alert-title">Silent SOS — Power button ×3</div>
                <div className="alert-meta">Device ID #4421 · Location: Floor 2</div>
              </div>
              <div className="alert-time">2:05</div>
            </div>
            <div className="alert-item low">
              <div className="alert-dot low"></div>
              <div className="alert-text">
                <div className="alert-title">Fall/collapse alert cleared</div>
                <div className="alert-meta">Human review: false positive · CAM-04 Stairway</div>
              </div>
              <div className="alert-time">5:31</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default IncidentList;