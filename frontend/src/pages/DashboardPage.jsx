import React, { useEffect, useState } from "react";
import { Shield, Activity, Settings, CheckCircle, Menu } from "lucide-react";
import CameraGrid from "../components/Cameras/CameraGrid";
import CameraFeed from "../components/Cameras/CameraFeed";
import SOSButton from "../components/SOS/SOSButton";
import StatsBar from "../components/Dashboard/StatsBar";
import ResponderList from "../components/Responders/ResponderList";
import MapView from "../components/Dashboard/MapView";
import { useIncidentStore } from "../store/incidentStore";
import { getIncidents } from "../api/incidents";
import useSocket from "../hooks/useSocket";
import GoogleMapView from "../components/Dashboard/GooglemapView";

export default function DashboardPage() {
  const [incidents, setIncidents] = useState([]);

  useSocket();

  useEffect(() => {
    getIncidents()
      .then((res) => {
        setIncidents(res.data.data);
      })
      .catch(() => {});
  }, []);

  const { confidences, verifications, triggerManualSOS, pipelineActive } =
    useIncidentStore();
  const alerts = useIncidentStore((state) => state.alerts);

  const getNodeClass = (index, baseColor) => {
    if (index === pipelineActive)
      return `border-${baseColor}-400 bg-${baseColor}-500/20 shadow-[0_0_15px_rgba(var(--${baseColor}-rgb),0.3)] scale-105`;
    if (index < pipelineActive)
      return `border-${baseColor}-500/50 bg-${baseColor}-500/10 opacity-70`;
    return "border-slate-700 bg-slate-800/30 opacity-50 grayscale";
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0b1120] text-slate-300 p-2 sm:p-4 font-sans relative">
      <header className="flex flex-wrap gap-4 items-center justify-between mb-4 px-2 w-full">
        <div className="flex items-center gap-3">
          <div className="bg-[#f97316] p-2 rounded-lg shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              SurviLens
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-widest uppercase hidden sm:block">
              AI-Powered Silent Distress Detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <div className="hidden md:flex bg-[#141d2e] rounded-full p-1 border border-slate-700">
            <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-700/50 text-white text-xs sm:text-sm font-medium">
              Overview
            </button>
            <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors">
              Analytics
            </button>
            <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-colors">
              Settings
            </button>
          </div>
          <div className="flex items-center gap-2 bg-[#112a1f] border border-green-800/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
            <span className="text-green-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
              System Active
            </span>
          </div>
          <button className="md:hidden p-2 bg-slate-800 rounded text-slate-300 hover:text-white">
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 w-full">
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
          <CameraGrid />
          <SOSButton />
        </div>

        <div className="col-span-1 lg:col-span-6 flex flex-col gap-4">
          {alerts.length > 0 && (
            <div className="bg-red-600 text-white p-3 rounded mb-3">
              ALERT: {alerts.join(", ")}
            </div>
          )}

          <div className="panel p-4 overflow-x-auto">
            <div className="panel-header mb-2">Detection Pipeline</div>
            <div className="flex flex-row justify-between items-center min-w-[500px]">
              <div
                className={`flex flex-col items-center border p-3 rounded-lg w-[22%] transition-all ${getNodeClass(0, "red")}`}
              >
                <Shield size={18} />
                <div className="text-xs font-bold text-white text-center">
                  AI Distress
                </div>
              </div>

              <div className="flex-1 h-px mx-2 bg-slate-700"></div>

              <div
                className={`flex flex-col items-center border p-3 rounded-lg w-[22%] transition-all ${getNodeClass(1, "orange")}`}
              >
                <Activity size={18} />
                <div className="text-xs font-bold text-white text-center">
                  Silent SOS
                </div>
              </div>

              <div className="flex-1 h-px mx-2 bg-slate-700"></div>

              <div
                className={`flex flex-col items-center border p-3 rounded-lg w-[22%] transition-all ${getNodeClass(2, "yellow")}`}
              >
                <Settings size={18} />
                <div className="text-xs font-bold text-white text-center">
                  Smart Verify
                </div>
              </div>

              <div className="flex-1 h-px mx-2 bg-slate-700"></div>

              <div
                className={`flex flex-col items-center border p-3 rounded-lg w-[22%] transition-all ${getNodeClass(3, "green")}`}
              >
                <CheckCircle size={18} />
                <div className="text-xs font-bold text-white text-center">
                  Respond
                </div>
              </div>
            </div>
          </div>
        <div className="flex flex-col gap-4">
          <MapView/>
          <GoogleMapView incidents={incidents} />
        </div>
            
        </div>

        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
          <StatsBar />
          <ResponderList />
        </div>
      </div>

      <CameraFeed />
    </div>
  );
}