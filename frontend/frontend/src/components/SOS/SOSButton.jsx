import { useContext } from "react";
import { AppContext } from "../../store/AppContext";

function SOSButton() {
  const { triggerAlert } = useContext(AppContext);

  return (
    <div>
      <div className="panel-title">Silent SOS Triggers</div>
      <div className="trigger-list">
        <div className="trigger-item active" onClick={() => triggerAlert("🆘 SOS", "Power Button")}>
          <div className="trigger-icon" style={{ background: "rgba(230,57,70,.15)" }}>📱</div>
          <div className="trigger-info">
            <div className="trigger-name">Power Button ×3</div>
            <div className="trigger-sub">Press 3 times rapidly</div>
          </div>
          <div className="trigger-count" style={{ background: "rgba(230,57,70,.12)", color: "var(--red-accent)" }}>3</div>
        </div>
        <div className="trigger-item" onClick={() => triggerAlert("🆘 SOS", "Hand Gesture")}>
          <div className="trigger-icon" style={{ background: "rgba(244,136,58,.1)" }}>✋</div>
          <div className="trigger-info">
            <div className="trigger-name">Hand Gesture</div>
            <div className="trigger-sub">Detected via CCTV AI</div>
          </div>
          <div className="trigger-count" style={{ background: "rgba(244,136,58,.1)", color: "var(--orange-accent)" }}>1</div>
        </div>
        <div className="trigger-item" onClick={() => triggerAlert("🆘 SOS", "Whisper")}>
          <div className="trigger-icon" style={{ background: "rgba(155,89,182,.1)" }}>🎤</div>
          <div className="trigger-info">
            <div className="trigger-name">Whisper "Help"</div>
            <div className="trigger-sub">Audio keyword detected</div>
          </div>
          <div className="trigger-count" style={{ background: "rgba(155,89,182,.1)", color: "var(--purple-accent)" }}>0</div>
        </div>
      </div>
    </div>
  );
}

export default SOSButton;
