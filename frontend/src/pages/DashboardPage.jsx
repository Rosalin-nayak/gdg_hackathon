import React,{useEffect,useState} from 'react';
import {getIncidents} from '../api';
import { 
  ShieldAlert, UserCheck, Search, Activity, PhoneCall, 
  MapPin, CheckCircle, Navigation, MessageSquare, Zap, 
  AlertTriangle, Eye, ArrowRight, Mic, Hand
} from 'lucide-react';
import './Dashboard.css';

const DashboardPage = () => {
  const[incidents,setIncidents]=useState([]);

  useEffect(() => {
    getIncidents()
      .then(data => {
        console.log("API SUCCESS:", data);
        setIncidents(data);
      })
      .catch(err => {
        console.error("API ERROR:", err);
      });
    }, []);
    

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-icon">
            <ShieldAlert size={24} />
          </div>
          <div className="header-title">
            <h1>Sentinel</h1>
            <p>AI-POWERED SILENT DISTRESS DETECTION</p>
          </div>
        </div>
        
        <div className="header-nav">
          <div className="nav-item active">Overview</div>
          <div className="nav-item">Analytics</div>
          <div className="nav-item">Settings</div>
        </div>
        
        <div className="header-status">
          <div className="status-dot"></div>
          System Active
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        
        {/* Left Column */}
        <div className="col-left">
          {/* CCTV Feeds */}
          <div className="panel">
            <div className="panel-header">CCTV FEEDS</div>
            <div className="cctv-grid">
              <div className="cctv-feed alert">
                <div className="cctv-label">CAM-01 • Lobby</div>
                <Activity size={32} color="#ef4444" />
              </div>
              <div className="cctv-feed">
                <div className="cctv-label">CAM-02 • Parking</div>
                <UserCheck size={32} color="#3b82f6" />
              </div>
              <div className="cctv-feed">
                <div className="cctv-label">CAM-03 • Exit</div>
                <div className="grid-lines" />
              </div>
              <div className="cctv-feed">
                <div className="cctv-label">CAM-04 • Stairway</div>
                <div className="crosshair" />
              </div>
            </div>
          </div>

          {/* Silent SOS Triggers */}
          <div className="panel flex-1">
            <div className="panel-header">SILENT SOS TRIGGERS</div>
            
            <div className="trigger-item active">
              <div className="flex items-center">
                <div className="trigger-icon"><Zap size={20} color="#ef4444" /></div>
                <div className="trigger-info">
                  <h4>Power Button ×3</h4>
                  <p>Press 3 times rapidly</p>
                </div>
              </div>
              <div className="trigger-count red">3</div>
            </div>

            <div className="trigger-item">
              <div className="flex items-center">
                <div className="trigger-icon"><Hand size={20} color="#f97316" /></div>
                <div className="trigger-info">
                  <h4>Hand Gesture</h4>
                  <p>Detected via CCTV AI</p>
                </div>
              </div>
              <div className="trigger-count orange">1</div>
            </div>

            <div className="trigger-item">
              <div className="flex items-center">
                <div className="trigger-icon"><Mic size={20} color="#94a3b8" /></div>
                <div className="trigger-info">
                  <h4>Whisper "Help"</h4>
                  <p>Audio keyword detected</p>
                </div>
              </div>
              <div className="trigger-count">0</div>
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div className="col-center">
          {/* Detection Pipeline */}
          <div className="panel">
            <div className="panel-header">DETECTION PIPELINE</div>
            <div className="pipeline-container">
              <div className="pipeline-step red">
                <Search size={20} className="step-icon" color="#ef4444" />
                <h4>AI Distress<br/>Detection</h4>
                <p>Violence • Chasing<br/>Fall</p>
              </div>
              <ArrowRight size={16} className="pipeline-arrow" />
              <div className="pipeline-step orange">
                <AlertTriangle size={20} className="step-icon" color="#f97316" />
                <h4>Silent SOS</h4>
                <p>Button • Gesture<br/>Voice</p>
              </div>
              <ArrowRight size={16} className="pipeline-arrow" />
              <div className="pipeline-step orange">
                <Eye size={20} className="step-icon" color="#f97316" />
                <h4>Smart Verify</h4>
                <p>Dashboard • Human<br/>review</p>
              </div>
              <ArrowRight size={16} className="pipeline-arrow" />
              <div className="pipeline-step green">
                <MapPin size={20} className="step-icon" color="#22c55e" />
                <h4>Respond</h4>
                <p>Live map • Assign</p>
              </div>
              <ArrowRight size={16} className="pipeline-arrow" />
              <div className="pipeline-step blue">
                <PhoneCall size={20} className="step-icon" color="#3b82f6" />
                <h4>Alert</h4>
                <p>App • SMS • Email</p>
              </div>
            </div>
          </div>

          <div className="center-middle">
            {/* AI Confidence */}
            <div className="panel confidence-bars">
              <div className="panel-header">AI CONFIDENCE</div>
              <div className="bar-row">
                <div className="bar-label">Violence</div>
                <div className="bar-track"><div className="bar-fill" style={{width: '87%', background: '#f97316'}}></div></div>
                <div className="bar-value">87%</div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Chasing</div>
                <div className="bar-track"><div className="bar-fill" style={{width: '72%', background: '#f97316'}}></div></div>
                <div className="bar-value">72%</div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Fall/Collapse</div>
                <div className="bar-track"><div className="bar-fill" style={{width: '44%', background: '#3b82f6'}}></div></div>
                <div className="bar-value">44%</div>
              </div>
            </div>

            {/* Smart Verification */}
            <div className="panel smart-verification">
              <div className="panel-header">SMART VERIFICATION</div>
              <div className="verify-stats">
                <div className="verify-stat red">
                  <h3>3</h3>
                  <p>Pending Review</p>
                </div>
                <div className="verify-stat green">
                  <h3>12</h3>
                  <p>Confirmed Safe</p>
                </div>
              </div>
              <button className="sos-trigger-btn">
                <Zap size={16} /> TRIGGER SILENT SOS
              </button>
            </div>
          </div>

          {/* Real-Time Response Map */}
          <div className="panel flex-1">
            <div className="flex justify-between items-center mb-2">
              <div className="panel-header" style={{margin:0}}>Real-Time Response Map</div>
              <div style={{fontSize: 12, color: '#22c55e'}}>● 2 responders active</div>
            </div>
            <div className="map-container">
              <div className="map-grid"></div>
              {/* Mock Map Elements */}
              <div style={{position:'absolute', top:'30%', left:'30%', padding:'10px', border:'1px solid #3b82f6', color:'#3b82f6', fontSize:10}}>C1</div>
              <div style={{position:'absolute', top:'40%', left:'35%', background:'rgba(239, 68, 68, 0.2)', border:'1px solid #ef4444', borderRadius:'50%', width:'30px', height:'30px', display:'flex', alignItems:'center', justifyContent:'center'}}><div style={{width:8,height:8,background:'#ef4444',borderRadius:'50%'}}></div></div>
              <div style={{position:'absolute', top:'50%', left:'45%', width:16,height:16,background:'#22c55e',color:'white',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:2}}>A</div>
              <div style={{position:'absolute', top:'60%', left:'40%', width:16,height:16,background:'#22c55e',color:'white',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:2}}>B</div>
              <div style={{position:'absolute', top:'30%', left:'55%', padding:'10px 40px', border:'1px solid #3b82f6', color:'#3b82f6', fontSize:10}}>Office</div>
              <div style={{position:'absolute', top:'30%', right:'10%', padding:'10px 20px', border:'1px solid #3b82f6', color:'#3b82f6', fontSize:10}}>C2 Parking</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-right">
          {/* Stats */}
          <div className="panel">
            <div className="panel-header">TODAY'S STATS</div>
            <div className="stats-grid">
              <div className="stat-card red">
                <h3>4</h3>
                <p>Incidents</p>
                <div className="sub-text" style={{color:'#ef4444'}}>▲ 2 from avg</div>
              </div>
              <div className="stat-card green">
                <h3>98%</h3>
                <p>Uptime</p>
                <div className="sub-text" style={{color:'#22c55e'}}>● Nominal</div>
              </div>
              <div className="stat-card">
                <h3>1.8s</h3>
                <p>Avg Detect</p>
                <div className="sub-text" style={{color:'#22c55e'}}>● Fast</div>
              </div>
              <div className="stat-card">
                <h3>12</h3>
                <p>Cameras</p>
                <div className="sub-text" style={{color:'#22c55e'}}>● All live</div>
              </div>
            </div>
          </div>

          {/* Security Team */}
          <div className="panel">
            <div className="panel-header">Security Team & Dispatch</div>
            <div className="team-list">
              <div className="team-member">
                <div className="member-info">
                  <div className="avatar orange">JD</div>
                  <div className="member-details">
                    <h4>J. Davis</h4>
                    <p>Unit Alpha - Lobby</p>
                  </div>
                </div>
                <div className="member-status red">En-route</div>
              </div>
              <div className="team-member">
                <div className="member-info">
                  <div className="avatar green">MB</div>
                  <div className="member-details">
                    <h4>M. Brown</h4>
                    <p>Unit Bravo - Floor 2</p>
                  </div>
                </div>
                <div className="member-status green">Available</div>
              </div>
              <div className="team-member">
                <div className="member-info">
                  <div className="avatar purple">SR</div>
                  <div className="member-details">
                    <h4>S. Reyes</h4>
                    <p>Emergency Dispatch</p>
                  </div>
                </div>
                <div className="member-status red">Active call</div>
              </div>
              <div className="team-member">
                <div className="member-info">
                  <div className="avatar" style={{background:'#3b82f6'}}>KL</div>
                  <div className="member-details">
                    <h4>K. Lee</h4>
                    <p>Control Room</p>
                  </div>
                </div>
                <div className="member-status green">Available</div>
              </div>
            </div>
          </div>

          {/* Multi-Channel Alerts */}
          <div className="panel flex-1">
            <div className="panel-header">MULTI-CHANNEL ALERTS</div>
            <div className="alert-list">
              <div className="alert-item">
                <div className="alert-info">
                  <MessageSquare size={16} color="#3b82f6" />
                  App Alert
                </div>
                <div className="alert-status green">✓ Sent</div>
              </div>
              <div className="alert-item">
                <div className="alert-info">
                  <MessageSquare size={16} color="#8b5cf6" />
                  SMS Alert
                </div>
                <div className="alert-status green">✓ Sent</div>
              </div>
              <div className="alert-item">
                <div className="alert-info">
                  <MessageSquare size={16} color="#f97316" />
                  Email Alert
                </div>
                <div className="alert-status orange">Queued</div>
              </div>
              <div className="alert-item">
                <div className="alert-info">
                  <PhoneCall size={16} color="#ef4444" />
                  Emergency Dispatch
                </div>
                <div className="alert-status green">✓ Notified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
