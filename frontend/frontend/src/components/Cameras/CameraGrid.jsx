import { useContext } from "react";
import { AppContext } from "../../store/AppContext";

function CameraGrid() {
  const { triggerAlert } = useContext(AppContext);

  return (
    <div>
      <div className="panel-title">CCTV Feeds</div>
      <div className="camera-grid">
        {/* CAM 1 - Alert */}
        <div className="camera-feed alert" onClick={() => triggerAlert("🚨 Violence", "Lobby")}>
          <div className="cam-scene">
            <div className="cam-grid-lines"></div>
            <svg style={{ width: '100%', height: '100%', position: 'absolute' }} viewBox="0 0 80 50">
              <rect x="5" y="28" width="16" height="18" rx="2" fill="rgba(74,144,232,.15)" stroke="rgba(74,144,232,.3)" strokeWidth=".5" />
              <rect x="28" y="32" width="12" height="14" rx="2" fill="rgba(74,144,232,.1)" stroke="rgba(74,144,232,.2)" strokeWidth=".5" />
              <rect x="55" y="25" width="20" height="21" rx="2" fill="rgba(74,144,232,.12)" stroke="rgba(74,144,232,.25)" strokeWidth=".5" />
              {/* Figure running */}
              <circle cx="42" cy="24" r="3" fill="rgba(230,57,70,.7)" />
              <line x1="42" y1="27" x2="42" y2="36" stroke="rgba(230,57,70,.7)" strokeWidth="1.5" />
              <line x1="42" y1="30" x2="37" y2="34" stroke="rgba(230,57,70,.7)" strokeWidth="1.5" />
              <line x1="42" y1="30" x2="47" y2="33" stroke="rgba(230,57,70,.7)" strokeWidth="1.5" />
              <line x1="42" y1="36" x2="39" y2="42" stroke="rgba(230,57,70,.7)" strokeWidth="1.5" />
              <line x1="42" y1="36" x2="46" y2="42" stroke="rgba(230,57,70,.7)" strokeWidth="1.5" />
              {/* Detection ring */}
              <circle cx="42" cy="32" r="8" fill="none" stroke="rgba(230,57,70,.6)" strokeWidth=".8" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="cam-alert-badge">ALERT</div>
          <div className="cam-rec"></div>
          <div className="cam-label">CAM-01 · Lobby</div>
        </div>
        {/* CAM 2 */}
        <div className="camera-feed" onClick={() => triggerAlert("🏃 Chasing", "Parking")}>
          <div className="cam-scene">
            <div className="cam-grid-lines"></div>
            <svg style={{ width: '100%', height: '100%', position: 'absolute' }} viewBox="0 0 80 50">
              <rect x="5" y="30" width="70" height="16" rx="1" fill="rgba(74,144,232,.06)" />
              <rect x="10" y="24" width="10" height="22" rx="1" fill="rgba(74,144,232,.1)" stroke="rgba(74,144,232,.2)" strokeWidth=".5" />
              <rect x="35" y="28" width="10" height="18" rx="1" fill="rgba(74,144,232,.1)" stroke="rgba(74,144,232,.2)" strokeWidth=".5" />
              <rect x="60" y="26" width="10" height="20" rx="1" fill="rgba(74,144,232,.1)" stroke="rgba(74,144,232,.2)" strokeWidth=".5" />
              {/* Calm figure */}
              <circle cx="48" cy="24" r="2.5" fill="rgba(74,144,232,.5)" />
              <line x1="48" y1="26.5" x2="48" y2="33" stroke="rgba(74,144,232,.5)" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="cam-rec"></div>
          <div className="cam-label">CAM-02 · Parking</div>
        </div>
        {/* CAM 3 */}
        <div className="camera-feed" onClick={() => triggerAlert("⚠️ Suspicious", "Exit")}>
          <div className="cam-scene">
            <div className="cam-grid-lines"></div>
            <svg style={{ width: '100%', height: '100%', position: 'absolute' }} viewBox="0 0 80 50">
              <rect x="5" y="20" width="70" height="26" rx="2" fill="rgba(74,144,232,.04)" />
              <line x1="5" y1="20" x2="5" y2="46" stroke="rgba(74,144,232,.15)" strokeWidth=".5" />
              <line x1="26" y1="20" x2="26" y2="46" stroke="rgba(74,144,232,.15)" strokeWidth=".5" />
              <line x1="47" y1="20" x2="47" y2="46" stroke="rgba(74,144,232,.15)" strokeWidth=".5" />
              <line x1="68" y1="20" x2="68" y2="46" stroke="rgba(74,144,232,.15)" strokeWidth=".5" />
            </svg>
          </div>
          <div className="cam-rec"></div>
          <div className="cam-label">CAM-03 · Exit</div>
        </div>
        {/* CAM 4 */}
        <div className="camera-feed" onClick={() => triggerAlert("🆘 Fall", "Stairway")}>
          <div className="cam-scene">
            <div className="cam-grid-lines"></div>
            <svg style={{ width: '100%', height: '100%', position: 'absolute' }} viewBox="0 0 80 50">
              <circle cx="40" cy="25" r="15" fill="none" stroke="rgba(74,144,232,.1)" strokeWidth="0.5" />
              <circle cx="40" cy="25" r="8" fill="none" stroke="rgba(74,144,232,.15)" strokeWidth="0.5" />
              <line x1="25" y1="25" x2="55" y2="25" stroke="rgba(74,144,232,.1)" strokeWidth=".5" />
              <line x1="40" y1="10" x2="40" y2="40" stroke="rgba(74,144,232,.1)" strokeWidth=".5" />
            </svg>
          </div>
          <div className="cam-rec"></div>
          <div className="cam-label">CAM-04 · Stairway</div>
        </div>
      </div>
    </div>
  );
}

export default CameraGrid;
