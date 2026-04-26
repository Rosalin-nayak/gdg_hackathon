import React from 'react'
import { X, Activity, Maximize, AlertTriangle } from 'lucide-react'
import { useIncidentStore } from '../../store/incidentStore'

export default function CameraFeed() {
  const { activeCamera, setActiveCamera } = useIncidentStore()

  if (!activeCamera) return null

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const renderFeedVisual = () => {
    if (activeCamera.status === 'Alert') {
      return (
        <div className="flex flex-col items-center justify-center relative w-full h-full bg-red-950/20">
          <div className="absolute w-32 h-32 border-2 border-red-500/50 rounded-full animate-ping"></div>
          <div className="absolute w-48 h-48 border border-red-500/30 rounded-full animate-ping delay-150"></div>
          <AlertTriangle size={64} className="text-red-500 z-10 drop-shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse" />
          <div className="absolute bottom-1/4 text-red-500 font-mono text-sm tracking-widest uppercase font-bold drop-shadow-[0_0_5px_rgba(239,68,68,1)] bg-black/50 px-3 py-1 rounded">Distress Detected</div>
        </div>
      )
    }

    if (activeCamera.id === 'cam-04') {
      // Night vision / Bright green theme for stairway
      return (
        <div className="flex flex-col items-center justify-center text-green-500 z-10 w-full h-full relative overflow-hidden shadow-[inset_0_0_100px_rgba(34,197,94,0.15)] bg-green-950/20">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, #22c55e 3px, #22c55e 3px)' }}></div>
          <div className="w-48 h-48 border border-green-500/40 rounded-full flex items-center justify-center relative z-10">
            <div className="w-32 h-32 border border-green-500/60 rounded-full"></div>
            <div className="w-16 h-16 border-2 border-green-400 rounded-full"></div>
            <div className="w-full h-px bg-green-500/40 absolute"></div>
            <div className="h-full w-px bg-green-500/40 absolute"></div>
            {/* Moving target dot */}
            <div className="w-3 h-3 bg-white rounded-full absolute shadow-[0_0_10px_white] animate-pulse" style={{ top: '30%', left: '40%' }}></div>
          </div>
          <div className="absolute bottom-1/4 text-green-400 font-mono text-sm tracking-widest uppercase font-bold bg-green-900/60 px-3 py-1 rounded border border-green-700/50 backdrop-blur-sm z-10">
            Night Vision Active
          </div>
        </div>
      )
    }

    if (activeCamera.id === 'cam-03') {
      // Grid theme for exit
      return (
        <div className="flex flex-col items-center justify-center text-slate-500 z-10 w-full h-full relative bg-blue-950/20">
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
          <div className="grid grid-cols-4 grid-rows-3 gap-2 w-3/4 h-3/4 opacity-40">
            {Array.from({length: 12}).map((_, i) => <div key={i} className="border border-blue-400/30 rounded"></div>)}
          </div>
          <div className="absolute top-1/3 left-1/3 w-16 h-16 border-2 border-yellow-400 rounded animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
          <div className="absolute bottom-1/4 text-blue-400 font-mono text-sm tracking-widest uppercase font-bold bg-blue-900/60 px-3 py-1 rounded border border-blue-700/50 backdrop-blur-sm">
            Zone Monitoring
          </div>
        </div>
      )
    }

    // Default (cam-02)
    return (
      <div className="flex flex-col items-center justify-center text-slate-500 z-10 w-full h-full relative bg-slate-900/50">
        {/* Corner markers */}
        <div className="absolute w-16 h-16 border-b-2 border-r-2 border-slate-600 bottom-8 right-8 opacity-70"></div>
        <div className="absolute w-16 h-16 border-t-2 border-l-2 border-slate-600 top-8 left-8 opacity-70"></div>
        <div className="absolute w-16 h-16 border-t-2 border-r-2 border-slate-600 top-8 right-8 opacity-70"></div>
        <div className="absolute w-16 h-16 border-b-2 border-l-2 border-slate-600 bottom-8 left-8 opacity-70"></div>
        
        {/* Center Target */}
        <div className="w-32 h-32 border-2 border-slate-600/50 rounded-full flex items-center justify-center relative shadow-[0_0_15px_rgba(71,85,105,0.2)]">
          <div className="w-16 h-16 border border-slate-500/50 rounded-full"></div>
          <div className="w-full h-px bg-slate-600/50 absolute"></div>
          <div className="h-full w-px bg-slate-600/50 absolute"></div>
          <div className="w-2 h-2 bg-blue-500/80 rounded-full absolute shadow-[0_0_8px_blue]"></div>
        </div>
        
        {/* Scanning line animation */}
        <div className="absolute inset-0 w-full h-4 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] opacity-50 pointer-events-none" style={{ animation: 'scan 3s linear infinite' }}>
          <style>{`
            @keyframes scan {
              0% { transform: translateY(-500px); }
              100% { transform: translateY(500px); }
            }
          `}</style>
        </div>
        
        <div className="absolute bottom-1/4 text-slate-400 font-mono text-sm tracking-widest uppercase font-bold bg-slate-900/60 px-3 py-1 rounded border border-slate-700/50 backdrop-blur-sm">
          System Secure - Monitoring Active
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-slate-700 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-white font-bold tracking-wide text-lg">{activeCamera.name}</div>
            <div className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded">{activeCamera.location}</div>
            {activeCamera.status === 'Alert' && (
              <div className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1 animate-pulse border border-red-500/30">
                <AlertTriangle size={12}/> Active Alert
              </div>
            )}
          </div>
          <button 
            onClick={() => setActiveCamera(null)} 
            className="text-slate-400 hover:text-white transition-colors p-1.5 bg-slate-800 hover:bg-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 min-h-[400px] overflow-y-auto md:overflow-hidden">
          {/* Main Feed */}
          <div className="flex-[2] bg-black relative border-b md:border-b-0 md:border-r border-slate-800 flex items-center justify-center overflow-hidden group min-h-[300px]">
            {/* Mock video / Grid Background Base */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            {renderFeedVisual()}

            {/* Overlays */}
            <div className="absolute top-4 right-4 text-red-500 flex items-center gap-2 font-mono text-xs font-bold bg-black/50 px-2 py-1 rounded z-20">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> REC
            </div>
            <div className="absolute bottom-4 left-4 text-green-400 font-mono text-xs opacity-70 bg-black/50 px-2 py-1 rounded z-20">
              {new Date().toISOString().replace('T', ' ').substring(0, 19)}
            </div>
          </div>

          {/* Side Panel (Features) */}
          <div className="flex-1 p-4 bg-slate-900/50 flex flex-col gap-5 overflow-y-auto md:max-w-[320px]">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Camera Diagnostics</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                  <div className="text-[10px] text-slate-500 mb-1">Resolution</div>
                  <div className="text-sm font-mono text-slate-300">4K UHD</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                  <div className="text-[10px] text-slate-500 mb-1">Framerate</div>
                  <div className="text-sm font-mono text-slate-300">60 FPS</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                  <div className="text-[10px] text-slate-500 mb-1">Latency</div>
                  <div className="text-sm font-mono text-green-400">12ms</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                  <div className="text-[10px] text-slate-500 mb-1">Network</div>
                  <div className="text-sm font-mono text-slate-300">Ethernet</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                AI Analytics <Activity size={14} className="text-blue-400"/>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded border border-slate-700/50">
                  <span className="text-xs text-slate-300">Motion Tracking</span>
                  <span className="text-xs text-green-400 font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded border border-slate-700/50">
                  <span className="text-xs text-slate-300">Object Detection</span>
                  <span className="text-xs text-green-400 font-bold">Active</span>
                </div>
                <div className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded border border-slate-700/50">
                  <span className="text-xs text-slate-300">Facial Recognition</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase bg-slate-800 px-1.5 py-0.5 rounded">Disabled</span>
                </div>
                <div className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded border border-slate-700/50">
                  <span className="text-xs text-slate-300">Aggression Analysis</span>
                  <span className={`text-xs font-bold ${activeCamera.status === 'Alert' ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                    {activeCamera.status === 'Alert' ? 'Triggered' : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <button className="mt-auto w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500">
              <Maximize size={16}/> View Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
