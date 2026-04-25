import { useContext } from "react";
import { AppContext } from "../../store/AppContext";

function RightPanel() {
  const { teamStatus } = useContext(AppContext);

  return (
    <div className="panel">
      <div className="title">Security Response</div>

      <p>Status: <b>{teamStatus}</b></p>

      <div className="title">Channels</div>
      <p>📱 App Alert ✔</p>
      <p>💬 SMS ✔</p>
      <p>📧 Email ✔</p>
      <p>🚨 Dispatch ✔</p>
    </div>
  );
}

export default RightPanel;