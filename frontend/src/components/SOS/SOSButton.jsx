import React from 'react'
import { Power, Hand, Mic } from 'lucide-react'
import { useIncidentStore } from '../../store/incidentStore'

export default function SOSButton() {
  const triggers = useIncidentStore((state) => state.triggers)
  const triggerSOS = useIncidentStore((state) => state.triggerSOS)

  return (
    <div className="panel p-4 flex-1 flex flex-col min-h-[250px]">
      <div className="panel-header mb-3">Silent SOS Triggers</div>
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        
        <button 
          onClick={() => triggerSOS('power')}
          className="w-full flex items-center justify-between bg-slate-800/40 border border-slate-700 rounded-lg p-3 hover:bg-slate-700/50 transition-colors group text-left focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <div className="flex items-center gap-3">
             <div className="bg-red-500/20 p-2 rounded text-red-400 group-hover:scale-110 transition-transform"><Power size={18}/></div>
             <div>
               <div className="text-sm font-bold text-white group-hover:text-red-100 transition-colors">Power Button ×3</div>
               <div className="text-[10px] text-slate-400">Press 3 times rapidly</div>
             </div>
          </div>
          <div className="bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded text-sm border border-red-500/30 min-w-[30px] text-center">{triggers.power}</div>
        </button>

        <button 
          onClick={() => triggerSOS('gesture')}
          className="w-full flex items-center justify-between bg-slate-800/40 border border-slate-700 rounded-lg p-3 hover:bg-slate-700/50 transition-colors group text-left focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <div className="flex items-center gap-3">
             <div className="bg-yellow-500/20 p-2 rounded text-yellow-400 group-hover:scale-110 transition-transform"><Hand size={18}/></div>
             <div>
               <div className="text-sm font-bold text-white group-hover:text-yellow-100 transition-colors">Hand Gesture</div>
               <div className="text-[10px] text-slate-400">Detected via CCTV AI</div>
             </div>
          </div>
          <div className="bg-yellow-500/20 text-yellow-400 font-bold px-2 py-0.5 rounded text-sm border border-yellow-500/30 min-w-[30px] text-center">{triggers.gesture}</div>
        </button>

        <button 
          onClick={() => triggerSOS('voice')}
          className="w-full flex items-center justify-between bg-slate-800/40 border border-slate-700 rounded-lg p-3 hover:bg-slate-700/50 transition-colors group text-left focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <div className="flex items-center gap-3">
             <div className="bg-slate-700/50 p-2 rounded text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition-all"><Mic size={18}/></div>
             <div>
               <div className="text-sm font-bold text-white group-hover:text-blue-100 transition-colors">Whisper "Help"</div>
               <div className="text-[10px] text-slate-400">Audio keyword detected</div>
             </div>
          </div>
          <div className="bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded text-sm border border-slate-700 min-w-[30px] text-center">{triggers.voice}</div>
        </button>
      </div>
    </div>
  )
}
