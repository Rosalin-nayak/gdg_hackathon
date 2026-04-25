import React from 'react';
import CameraGrid from '../components/Cameras/CameraGrid';
import SOSButton from '../components/SOS/SOSButton';
import Dashboard from '../components/Dashboard/Dashboard';
import ResponderList from '../components/Responders/ResponderList';
import IncidentList from '../components/Incidents/IncidentList';

function DashboardPage() {
  return (
    <div className="main">
      <div className="left-panel">
        <CameraGrid />
        <SOSButton />
      </div>
      <div className="center-panel">
        <Dashboard />
        <IncidentList />
      </div>
      <div className="right-panel">
        <ResponderList />
      </div>
    </div>
  );
}

export default DashboardPage;
