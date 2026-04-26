import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { useIncidentStore } from '../../store/incidentStore'

export default function CameraGrid() {
  const setActiveCamera = useIncidentStore((state) => state.setActiveCamera)

  const cameras = [
    { id: 'cam-01', name: 'CAM-01', location: 'Lobby', status: 'Alert', hasWarning: true },
    { id: 'cam-02', name: 'CAM-02', location: 'Parking', status: null, hasWarning: false },
    { id: 'cam-03', name: 'CAM-03', location: 'Exit', status: null, hasWarning: false },
    { id: 'cam-04', name: 'CAM-04', location: 'Stairway', status: null, hasWarning: false }
  ]

  return (
    <div className="panel p-4 flex-[0.8] flex flex-col min-h-[250px] lg:min-h-0">
      <div className="panel-header mb-3">CCTV Feeds</div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        
        {/* Cam 1 */}
        <button 
          onClick={() => setActiveCamera(cameras[0])}
          className="relative border border-red-500/70 rounded bg-slate-900 overflow-hidden flex items-center justify-center min-h-[100px] shadow-[inset_0_0_15px_rgba(239,68,68,0.2)] hover:border-red-400 transition-colors group cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase z-20">Alert</div>
          <div className="absolute bottom-1 left-1 text-[9px] sm:text-[10px] font-mono text-slate-300 bg-black/50 px-1 rounded z-20 group-hover:bg-black/80 transition-colors">CAM-01 • Lobby</div>
          <div className="text-red-500 flex flex-col items-center justify-center relative w-full h-full group-hover:scale-105 transition-transform">
             <div className="absolute w-10 h-10 border border-red-500/50 rounded-full animate-ping"></div>
             <AlertTriangle size={28} className="z-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
        </button>
        
        {/* Cam 2 */}
        <button 
          onClick={() => setActiveCamera(cameras[1])}
          className="relative border border-slate-700/80 rounded bg-slate-900/50 overflow-hidden flex items-center justify-center min-h-[100px] hover:border-blue-500/50 hover:bg-slate-800/80 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="absolute bottom-1 left-1 text-[9px] sm:text-[10px] font-mono text-slate-400 bg-black/50 px-1 rounded z-20 group-hover:bg-black/80 group-hover:text-white transition-colors">CAM-02 • Parking</div>
          <div className="absolute top-1 right-1 flex items-center gap-1 z-20"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_blue]"></div></div>
          <div className="w-full h-full flex flex-col items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity">
             <div className="w-1/2 h-8 border-b-2 border-r-2 border-slate-600 absolute bottom-4 right-4"></div>
             <div className="w-1/2 h-8 border-t-2 border-l-2 border-slate-600 absolute top-4 left-4"></div>
          </div>
        </button>

        {/* Cam 3 */}
        <button 
          onClick={() => setActiveCamera(cameras[2])}
          className="relative border border-slate-700/80 rounded bg-slate-900/50 overflow-hidden flex items-center justify-center min-h-[100px] hover:border-blue-500/50 hover:bg-slate-800/80 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="absolute bottom-1 left-1 text-[9px] sm:text-[10px] font-mono text-slate-400 bg-black/50 px-1 rounded z-20 group-hover:bg-black/80 group-hover:text-white transition-colors">CAM-03 • Exit</div>
          <div className="w-full h-full opacity-30 group-hover:opacity-50 transition-opacity" style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
        </button>

        {/* Cam 4 */}
        <button 
          onClick={() => setActiveCamera(cameras[3])}
          className="relative border border-slate-700/80 rounded bg-slate-900/50 overflow-hidden flex items-center justify-center min-h-[100px] hover:border-green-500/50 hover:bg-slate-800/80 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <div className="absolute bottom-1 left-1 text-[9px] sm:text-[10px] font-mono text-slate-400 bg-black/50 px-1 rounded z-20 group-hover:bg-black/80 group-hover:text-white transition-colors">CAM-04 • Stairway</div>
          <div className="w-16 h-16 rounded-full border border-slate-500 opacity-60 flex items-center justify-center relative group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300 group-hover:border-green-500/50">
             <div className="w-8 h-8 border border-slate-400 group-hover:border-green-400 rounded-full transition-colors"></div>
             <div className="w-full h-px bg-slate-400 group-hover:bg-green-400 absolute transition-colors"></div>
             <div className="h-full w-px bg-slate-400 group-hover:bg-green-400 absolute transition-colors"></div>
          </div>
        </button>

      </div>
    </div>
  )
}
