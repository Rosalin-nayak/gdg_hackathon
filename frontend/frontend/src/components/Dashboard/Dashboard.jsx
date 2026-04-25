import { useContext } from "react";
import { AppContext } from "../../store/AppContext";
import MapView from "./MapView";

function Dashboard() {
  const { confidence, incident, responderPos, triggerAlert } = useContext(AppContext);

  return (
    <>
      {/* Flow */}
      <div className="flow-section">
        <div className="panel-title" style={{ marginBottom: "10px" }}>Detection Pipeline</div>
        <div className="flow-steps">
          <div className="flow-step">
            <div className="flow-node detect">
              <div className="flow-node-icon">🔍</div>
              <div className="flow-node-title" style={{ color: "#e63946" }}>AI Distress Detection</div>
              <div className="flow-node-sub">Violence · Chasing · Fall</div>
            </div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-node sos">
              <div className="flow-node-icon">🆘</div>
              <div className="flow-node-title" style={{ color: "#e05260" }}>Silent SOS</div>
              <div className="flow-node-sub">Button · Gesture · Voice</div>
            </div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-node verify">
              <div className="flow-node-icon">✅</div>
              <div className="flow-node-title" style={{ color: "#f4883a" }}>Smart Verify</div>
              <div className="flow-node-sub">Dashboard · Human review</div>
            </div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-node respond">
              <div className="flow-node-icon">📍</div>
              <div className="flow-node-title" style={{ color: "#2ecc71" }}>Respond</div>
              <div className="flow-node-sub">Live map · Assign</div>
            </div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="flow-node alert">
              <div className="flow-node-icon">📣</div>
              <div className="flow-node-title" style={{ color: "#9b59b6" }}>Alert</div>
              <div className="flow-node-sub">App · SMS · Email</div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification row */}
      <div className="verif-row">
        <div className="verif-card">
          <div className="verif-label">AI Confidence</div>
          <div className="conf-row">
            <div className="conf-label">Violence</div>
            <div className="conf-track"><div className="conf-bar" style={{ width: `${confidence.violence}%`, background: "var(--red-accent)" }}></div></div>
            <div className="conf-val">{confidence.violence}%</div>
          </div>
          <div className="conf-row">
            <div className="conf-label">Chasing</div>
            <div className="conf-track"><div className="conf-bar" style={{ width: `${confidence.chasing}%`, background: "var(--orange-accent)" }}></div></div>
            <div className="conf-val">{confidence.chasing}%</div>
          </div>
          <div className="conf-row">
            <div className="conf-label">Fall/Collapse</div>
            <div className="conf-track"><div className="conf-bar" style={{ width: `${confidence.fall}%`, background: "var(--blue-accent)" }}></div></div>
            <div className="conf-val">{confidence.fall}%</div>
          </div>
        </div>
        <div className="verif-card">
          <div className="verif-label">Smart Verification</div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ flex: 1, textAlign: "center", padding: "6px", background: "rgba(230,57,70,.08)", borderRadius: "6px", border: "1px solid rgba(230,57,70,.2)" }}>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "var(--red-accent)" }}>3</div>
              <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>Pending Review</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", padding: "6px", background: "rgba(46,204,113,.06)", borderRadius: "6px", border: "1px solid rgba(46,204,113,.15)" }}>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "var(--green-accent)" }}>12</div>
              <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>Confirmed Safe</div>
            </div>
          </div>
          <button className="sos-btn" onClick={() => triggerAlert("🆘 Manual Trigger", "Security")}>
            ⚡ Trigger Silent SOS
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="map-section">
        <div className="map-header">
          <div className="map-header-title">Real-Time Response Map</div>
          <div style={{ fontSize: "10px", color: "var(--green-accent)", display: "flex", alignItems: "center", gap: "4px" }}>
            <div className="status-dot" style={{ width: "5px", height: "5px", background: "var(--green-accent)" }}></div>
            2 responders active
          </div>
        </div>
        <div className="map-body" style={{ height: "300px" }}>
          {/* We use our actual MapView component here instead of mock HTML map */}
          <MapView incident={incident} responderPos={responderPos} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
