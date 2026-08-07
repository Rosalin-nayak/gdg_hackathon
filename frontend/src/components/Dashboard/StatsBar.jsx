import React from 'react'
import { useIncidentStore } from '../../store/incidentStore'

export default function StatsBar() {
  const stats = useIncidentStore((state) => state.stats)

  return (
    <div className="panel p-4">
      <div className="panel-header mb-3">Live Stats</div>
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col justify-center transition-all hover:bg-slate-800/60">
          <div className={`text-2xl font-bold text-red-400 ${stats.open > 0 ? 'animate-pulse' : ''}`}>
            {stats.incidents}
          </div>
          <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5 whitespace-nowrap">
            Incidents
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
            {stats.open} open
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col justify-center transition-all hover:bg-slate-800/60">
          <div className="text-2xl font-bold text-white">{stats.open}</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5 whitespace-nowrap">
            Open
          </div>
          <div className="text-[10px] text-orange-400 mt-0.5 font-medium">
            Needs attention
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col justify-center transition-all hover:bg-slate-800/60">
          <div className="text-2xl font-bold text-white">{stats.responders}</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5 whitespace-nowrap">
            Responders
          </div>
          <div className="text-[10px] text-blue-400 mt-0.5 font-medium">
            From API
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col justify-center transition-all hover:bg-slate-800/60">
          <div className="text-2xl font-bold text-white">{stats.cameras}</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5 whitespace-nowrap">
            Cameras
          </div>
          <div className="text-[10px] text-green-500 mt-0.5 font-medium">
            Configured
          </div>
        </div>
      </div>
    </div>
  )
}
