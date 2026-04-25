import { useContext } from "react";
import { AppContext } from "../../store/AppContext";

function LeftPanel() {
  const { triggerAlert } = useContext(AppContext);

  return (
    <div className="panel">
      <div className="title">CCTV AI Feeds</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        <div className="camera alert" onClick={() => triggerAlert("🚨 Violence", "Lobby")}>CAM 1</div>
        <div className="camera" onClick={() => triggerAlert("🏃 Chasing", "Parking")}>CAM 2</div>
        <div className="camera" onClick={() => triggerAlert("⚠️ Suspicious", "Corridor")}>CAM 3</div>
        <div className="camera" onClick={() => triggerAlert("🆘 Fall", "Exit")}>CAM 4</div>
      </div>

      <button
        style={{ marginTop: "10px", background: "red", color: "white", width: "100%" }}
        onClick={() => triggerAlert("🆘 SOS Triggered", "User Device")}
      >
        ⚡ Silent SOS
      </button>
    </div>
  );
}

export default LeftPanel;