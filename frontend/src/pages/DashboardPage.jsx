import React, { useEffect, useState } from "react";
import { Shield, Activity, Settings, CheckCircle, Menu } from "lucide-react";
import CameraGrid from "../components/Cameras/CameraGrid";
import CameraFeed from "../components/Cameras/CameraFeed";
import SOSButton from "../components/SOS/SOSButton";
import StatsBar from "../components/Dashboard/StatsBar";
import ResponderList from "../components/Responders/ResponderList";
import MapView from "../components/Dashboard/MapView";
import { useIncidentStore } from "../store/incidentStore";
import Dashboard from "../components/Dashboard/Dashboard";
import { getIncidents } from "../api/incidents";

export default function DashboardPage() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    getIncidents()
      .then((res) => {
        console.log(res.data);
        setIncidents(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // console.log("DashboardPage loaded");

  // useEffect(()=>{
  //   getIncidents()
  //   .then(data=>console.log("INCIDENTS:",data))
  //   .catch(err=>console.error(err))
  // },[]);

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
              Sentinel
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
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse shrink-0"></div>
            <span className="text-green-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
              System Active
            </span>
          </div>
          <button className="md:hidden p-2 bg-slate-800 rounded text-slate-300 hover:text-white">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 w-full">
        {/* Left Column (3) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
          <CameraGrid />
          <SOSButton />
        </div>

        {/* Center Column (6) */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-4">
          
          {alerts.length > 0 && (
            <div className="bg-red-600 text-white p-3 rounded mb-3 animate-pulse">
              🚨 ALERT: {alerts.join(", ")}
            </div>
          )}

          {/* Top pipeline */}
          <div className="panel p-4 overflow-x-auto">
            <div className="panel-header mb-2">Detection Pipeline</div>
            {/* Pipeline visual */}
            <div className="flex flex-row justify-between items-center min-w-[500px]">
              {/* Node 1 */}
              <div
                className={`flex flex-col items-center border p-3 rounded-lg w-[22%] transition-all ${getNodeClass(0, "red")}`}
              >
                <div
                  className={`${pipelineActive >= 0 ? "text-red-400" : "text-slate-500"} mb-1`}
                >
                  <Shield size={18} />
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-white text-center leading-tight">
                  AI Distress
                  <br />
                  Detection
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-400 mt-1 text-center hidden sm:block">
                  Violence - Chasing - Fall
                </div>
              </div>
              <div
                className={`flex-1 h-px mx-2 relative transition-colors ${pipelineActive >= 1 ? "bg-red-500/50" : "bg-slate-700"}`}
              >
                <div
                  className={`absolute right-0 top-[-3px] border-[3px] border-transparent transition-colors ${pipelineActive >= 1 ? "border-l-red-500/50" : "border-l-slate-700"}`}
                ></div>
              </div>

              {/* Node 2 */}
              <div
                className={`flex flex-col items-center border p-3 rounded-lg w-[22%] transition-all ${getNodeClass(1, "orange")}`}
              >
                <div
                  className={`${pipelineActive >= 1 ? "text-orange-400" : "text-slate-500"} mb-1`}
                >
                  <Activity size={18} />
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-white text-center leading-tight">
                  Silent SOS
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-400 mt-1 text-center hidden sm:block">
                  Button - Gesture - Voice
                </div>
              </div>
              <div
                className={`flex-1 h-px mx-2 relative transition-colors ${pipelineActive >= 2 ? "bg-orange-500/50" : "bg-slate-700"}`}
              >
                <div
                  className={`absolute right-0 top-[-3px] border-[3px] border-transparent transition-colors ${pipelineActive >= 2 ? "border-l-orange-500/50" : "border-l-slate-700"}`}
                ></div>
              </div>

              {/* Node 3 */}
              <div
                className={`flex flex-col items-center border p-3 rounded-lg w-[22%] transition-all ${getNodeClass(2, "yellow")}`}
              >
                <div
                  className={`${pipelineActive >= 2 ? "text-yellow-400" : "text-slate-500"} mb-1`}
                >
                  <Settings size={18} />
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-white text-center leading-tight">
                  Smart Verify
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-400 mt-1 text-center hidden sm:block">
                  Dashboard - Human review
                </div>
              </div>
              <div
                className={`flex-1 h-px mx-2 relative transition-colors ${pipelineActive >= 3 ? "bg-yellow-500/50" : "bg-slate-700"}`}
              >
                <div
                  className={`absolute right-0 top-[-3px] border-[3px] border-transparent transition-colors ${pipelineActive >= 3 ? "border-l-yellow-500/50" : "border-l-slate-700"}`}
                ></div>
              </div>

              {/* Node 4 */}
              <div
                className={`flex flex-col items-center border p-3 rounded-lg w-[22%] transition-all ${getNodeClass(3, "green")}`}
              >
                <div
                  className={`${pipelineActive >= 3 ? "text-green-400" : "text-slate-500"} mb-1`}
                >
                  <CheckCircle size={18} />
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-white text-center leading-tight">
                  Respond
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-400 mt-1 text-center hidden sm:block">
                  Live map - Assign
                </div>
              </div>
            </div>
          </div>

          {/* AI Confidence & Smart Verify row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="panel p-4 flex-1">
              <div className="panel-header">AI Confidence</div>
              <div className="space-y-3 mt-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Violence</span>
                    <span className="text-white font-mono">
                      {confidences.violence}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                      style={{ width: `${confidences.violence}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Chasing</span>
                    <span className="text-white font-mono">
                      {confidences.chasing}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500/70 rounded-full transition-all duration-1000"
                      style={{ width: `${confidences.chasing}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Fall/Collapse</span>
                    <span className="text-white font-mono">
                      {confidences.fall}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${confidences.fall}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel p-4 sm:w-[280px] flex flex-col justify-between">
              <div className="panel-header">Smart Verification</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-slate-800/50 rounded p-2 text-center border border-slate-700">
                  <div className="text-xl font-bold text-red-400 transition-all">
                    {verifications.pending}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase">
                    Pending Review
                  </div>
                </div>
                <div className="bg-green-900/20 rounded p-2 text-center border border-green-800/30">
                  <div className="text-xl font-bold text-green-400">
                    {verifications.confirmedSafe}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-green-500 uppercase">
                    Confirmed Safe
                  </div>
                </div>
              </div>
              <button
                onClick={triggerManualSOS}
                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm py-2 sm:py-3 rounded shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                <span className="animate-pulse">⚡</span> Trigger Silent SOS
              </button>
            </div>
          </div>

          <MapView />

          {/* 🔥 INCIDENTS FROM BACKEND
          <div className="panel p-4">
            <div className="panel-header">Live Incidents (Backend)</div>

            {incidents.length === 0 ? (
              <p className="text-slate-400 text-sm mt-2">No incidents found</p>
            ) : (
              <div className="mt-2 space-y-2">
                {incidents.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 bg-slate-800/50 rounded border border-slate-700 text-sm"
                  >
                    {item.title || JSON.stringify(item)}
                  </div>
                ))}
              </div>
            )}
          </div>*/}
        </div>

        {/* Right Column (3) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
          <StatsBar />
          <ResponderList />

          {/* Multi-Channel Alerts */}
          <div className="panel p-4 flex-1 mb-4 lg:mb-0">
            <div className="panel-header">Multi-Channel Alerts</div>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between items-center p-2 rounded bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/20 p-1.5 rounded text-blue-400">
                    <Shield size={14} />
                  </div>
                  <span className="text-sm">App Alert</span>
                </div>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  ✓ Sent
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500/20 p-1.5 rounded text-green-400">
                    <Shield size={14} />
                  </div>
                  <span className="text-sm">SMS Alert</span>
                </div>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  ✓ Sent
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/20 p-1.5 rounded text-yellow-400">
                    <Shield size={14} />
                  </div>
                  <span className="text-sm">Email Alert</span>
                </div>
                <span className="text-xs text-yellow-400">Queued</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-red-900/20 border border-red-800/30 mt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-red-500/20 p-1.5 rounded text-red-400 animate-pulse">
                    <Shield size={14} />
                  </div>
                  <span className="text-sm text-red-200">
                    Emergency Dispatch
                  </span>
                </div>
                <span className="text-xs text-orange-400 font-bold">
                  ✓ Notified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Feed Modal */}
      <CameraFeed />
    </div>
  );
}
