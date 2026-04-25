import { useContext } from "react";
import { AppContext } from "../../store/AppContext";

function ResponderList() {
  const { teamStatus } = useContext(AppContext);

  return (
    <>
      <div>
        <div className="panel-title">Today's Stats</div>
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-val" style={{ color: "var(--red-accent)" }}>4</div><div className="stat-label">Incidents</div><div className="stat-trend up">▲ 2 from avg</div></div>
          <div className="stat-card"><div className="stat-val" style={{ color: "var(--green-accent)" }}>98%</div><div className="stat-label">Uptime</div><div className="stat-trend ok">● Nominal</div></div>
          <div className="stat-card"><div className="stat-val">1.8s</div><div className="stat-label">Avg Detect</div><div className="stat-trend ok">● Fast</div></div>
          <div className="stat-card"><div className="stat-val">12</div><div className="stat-label">Cameras</div><div className="stat-trend ok">● All live</div></div>
        </div>
      </div>

      <div className="dispatch-section">
        <div className="dispatch-title">Security Team & Dispatch</div>
        <div className="responder-list">
          <div className="resp-item">
            <div className="resp-avatar" style={{ background: "rgba(230,57,70,.15)", color: "var(--red-accent)" }}>JD</div>
            <div className="resp-info"><p className="resp-name">J. Davis</p><p className="resp-role">Unit Alpha · Lobby</p></div>
            <div className="resp-status en-route">En-route</div>
          </div>
          <div className="resp-item">
            <div className="resp-avatar" style={{ background: "rgba(46,204,113,.12)", color: "var(--green-accent)" }}>MB</div>
            <div className="resp-info"><p className="resp-name">M. Brown</p><p className="resp-role">Unit Bravo · Floor 2</p></div>
            <div className="resp-status available">Available</div>
          </div>
          <div className="resp-item">
            <div className="resp-avatar" style={{ background: "rgba(244,136,58,.1)", color: "var(--orange-accent)" }}>SR</div>
            <div className="resp-info"><p className="resp-name">S. Reyes</p><p className="resp-role">Emergency Dispatch</p></div>
            <div className="resp-status busy">Active call</div>
          </div>
          <div className="resp-item">
            <div className="resp-avatar" style={{ background: "rgba(155,89,182,.1)", color: "var(--purple-accent)" }}>KL</div>
            <div className="resp-info"><p className="resp-name">K. Lee</p><p className="resp-role">Control Room</p></div>
            <div className="resp-status available">Available</div>
          </div>
        </div>
      </div>

      <div>
        <div className="panel-title" style={{ marginBottom: "6px" }}>Multi-Channel Alerts</div>
        <div className="channel-list">
          <div className="channel-item">
            <div className="channel-icon" style={{ background: "rgba(45,107,228,.15)" }}>📱</div>
            <p className="channel-name" style={{ fontSize: "11px" }}>App Alert</p>
            <div className="channel-sent">✓ Sent</div>
          </div>
          <div className="channel-item">
            <div className="channel-icon" style={{ background: "rgba(46,204,113,.1)" }}>💬</div>
            <p className="channel-name" style={{ fontSize: "11px" }}>SMS Alert</p>
            <div className="channel-sent">✓ Sent</div>
          </div>
          <div className="channel-item">
            <div className="channel-icon" style={{ background: "rgba(244,136,58,.1)" }}>📧</div>
            <p className="channel-name" style={{ fontSize: "11px" }}>Email Alert</p>
            <div className="channel-sent" style={{ color: "var(--orange-accent)" }}>Queued</div>
          </div>
          <div className="channel-item">
            <div className="channel-icon" style={{ background: "rgba(230,57,70,.1)" }}>🚨</div>
            <p className="channel-name" style={{ fontSize: "11px" }}>Emergency Dispatch</p>
            <div className="channel-sent">✓ Notified</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", background: "rgba(46,204,113,.04)", border: "1px solid rgba(46,204,113,.15)", borderRadius: "6px" }}>
          <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Detect</span>
          <span style={{ fontSize: "10px", color: "var(--red-accent)", fontWeight: 500 }}>● Active</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", background: "rgba(244,136,58,.04)", border: "1px solid rgba(244,136,58,.15)", borderRadius: "6px" }}>
          <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Verify</span>
          <span style={{ fontSize: "10px", color: "var(--orange-accent)", fontWeight: 500 }}>● 3 Pending</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", background: "rgba(46,204,113,.04)", border: "1px solid rgba(46,204,113,.15)", borderRadius: "6px" }}>
          <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Respond</span>
          <span style={{ fontSize: "10px", color: "var(--green-accent)", fontWeight: 500 }}>● Units Deployed</span>
        </div>
      </div>
    </>
  );
}

export default ResponderList;
