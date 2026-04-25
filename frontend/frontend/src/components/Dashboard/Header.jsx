function Header() {
  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7z" />
            <circle cx="12" cy="12" r="3" fill="#fff" stroke="none" />
          </svg>
        </div>
        <div className="logo-text">
          <h1>Sentinel</h1>
          <p>AI-Powered Silent Distress Detection</p>
        </div>
      </div>
      <div className="header-status">
        <div className="nav-tabs">
          <div className="nav-tab active">Overview</div>
          <div className="nav-tab">Analytics</div>
          <div className="nav-tab">Settings</div>
        </div>
        <div className="status-badge live">
          <div className="status-dot"></div>
          System Active
        </div>
      </div>
    </div>
  );
}

export default Header;