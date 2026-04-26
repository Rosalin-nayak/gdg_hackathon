import React from 'react'
import { useIncidentStore } from '../../store/incidentStore'

export default function MapView() {
  const mapIncidents = useIncidentStore((state) => state.mapIncidents)

  return (
    <div className="panel p-4 flex-1 flex flex-col min-h-[250px] lg:min-h-[220px]">
      <div className="flex justify-between items-center mb-3">
        <div className="panel-header !mb-0">Real-Time Response Map</div>
        <div className="text-[10px] text-green-400 font-bold flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          2 responders active
        </div>
      </div>
      
      <div className="flex-1 border border-slate-700/50 rounded-lg bg-[#0a101d] relative overflow-hidden shadow-inner min-h-[150px]">
        {/* Map Grid Background */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.4
        }}></div>

        {/* Rooms / Zones outlines */}
        <div className="absolute top-[20%] left-[15%] w-[20%] h-[25%] border border-blue-500/30 bg-blue-900/10 flex items-center justify-center text-[10px] sm:text-xs text-blue-400/60 font-mono">C1</div>
        
        <div className="absolute top-[20%] left-[45%] w-[20%] h-[20%] border border-blue-500/30 bg-blue-900/10 flex items-center justify-center text-[10px] sm:text-xs text-blue-400/60 font-mono">Office</div>

        <div className="absolute top-[20%] right-[10%] w-[15%] h-[35%] border border-blue-500/30 bg-blue-900/10 flex items-center justify-center text-[8px] sm:text-[10px] text-blue-400/60 font-mono text-center leading-tight">C2<br/>Parking</div>
        
        <div className="absolute bottom-[20%] left-[20%] w-[50%] h-[15%] border border-blue-500/30 bg-blue-900/10 flex items-center justify-center text-[10px] sm:text-xs text-blue-400/60 font-mono">Corridor</div>

        {/* Dynamic Incidents Rendered from State */}
        {mapIncidents.map((incident) => (
          <div key={incident.id} className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out" style={{ top: `${incident.top}%`, left: `${incident.left}%` }}>
             <div className="w-8 h-8 bg-red-500/30 rounded-full animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
             <div className="w-3 h-3 bg-red-500 rounded-full border border-red-300 shadow-[0_0_12px_rgba(239,68,68,1)] relative z-10 flex items-center justify-center">
               <div className="w-1 h-1 bg-white rounded-full"></div>
             </div>
             <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-red-400 uppercase mt-1 whitespace-nowrap bg-slate-900/80 px-1 rounded">{incident.location}</div>
          </div>
        ))}

        {/* Responders (Static for now, could be dynamic) */}
        <div className="absolute top-[55%] left-[40%] -translate-x-1/2 -translate-y-1/2 bg-green-500 text-[8px] font-bold text-white px-1.5 py-0.5 rounded shadow z-10 flex items-center gap-1">
          <div className="w-1 h-1 bg-white rounded-full"></div> A
        </div>
        
        <div className="absolute bottom-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-green-500 text-[8px] font-bold text-white px-1.5 py-0.5 rounded shadow z-10 flex items-center gap-1">
          <div className="w-1 h-1 bg-white rounded-full"></div> B
        </div>
      </div>
    </div>
  )
}
