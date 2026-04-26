import React from 'react'
import { useIncidentStore } from '../../store/incidentStore'

export default function StatsBar() {
  const stats = useIncidentStore((state) => state.stats)

  return (
    <div className="panel p-4">
      <div className="panel-header mb-3">Today's Stats</div>
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Stat 1 */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col justify-center transition-all hover:bg-slate-800/60">
          <div className="text-2xl font-bold text-red-400 animate-pulse">{stats.incidents}</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5 whitespace-nowrap">Incidents</div>
          <div className="text-[10px] text-red-400 mt-0.5 font-medium">▲ 2 from avg</div>
        </div>
        
        {/* Stat 2 */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col justify-center transition-all hover:bg-slate-800/60">
          <div className="text-2xl font-bold text-green-400">{stats.uptime}%</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5 whitespace-nowrap">Uptime</div>
          <div className="text-[10px] text-green-500 mt-0.5 font-medium">• Nominal</div>
        </div>

        {/* Stat 3 */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col justify-center transition-all hover:bg-slate-800/60">
          <div className="text-2xl font-bold text-white">{stats.avgDetect}s</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5 whitespace-nowrap">Avg Detect</div>
          <div className="text-[10px] text-blue-400 mt-0.5 font-medium">• Fast</div>
        </div>

        {/* Stat 4 */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col justify-center transition-all hover:bg-slate-800/60">
          <div className="text-2xl font-bold text-white">{stats.cameras}</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase mt-0.5 whitespace-nowrap">Cameras</div>
          <div className="text-[10px] text-green-500 mt-0.5 font-medium">• All live</div>
        </div>
      </div>
    </div>
  )
}
