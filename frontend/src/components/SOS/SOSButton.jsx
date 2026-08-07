import React, { useState } from 'react'
import { Power, Hand, Mic } from 'lucide-react'
import { useIncidentStore } from '../../store/incidentStore'
import { createIncident } from '../../api/incidents'

const TYPE_BY_TRIGGER = {
  power: 'manual_sos',
  gesture: 'sos',
  voice: 'audio_help',
}

export default function SOSButton() {
  const incidents = useIncidentStore((state) => state.incidents)
  const addIncident = useIncidentStore((state) => state.addIncident)
  const [busy, setBusy] = useState(false)

  const triggers = {
    power: incidents.filter((i) => i.type === 'manual_sos').length,
    gesture: incidents.filter((i) => i.type === 'sos').length,
    voice: incidents.filter((i) => i.type === 'audio_help').length,
  }

  const fire = async (kind) => {
    if (busy) return
    setBusy(true)
    try {
      const res = await createIncident({
        type: TYPE_BY_TRIGGER[kind],
        cameraId: 'CAM_01',
        confidence: 1,
        location: { zone: 'Lobby' },
      })
      if (res.data?.data) {
        addIncident(res.data.data)
      }
    } catch (err) {
      console.error('Manual SOS failed:', err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="panel p-4 flex-1 flex flex-col min-h-[250px]">
      <div className="panel-header mb-3">Silent SOS Triggers</div>
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <button
          onClick={() => fire('power')}
          disabled={busy}
          className="w-full flex items-center justify-between bg-slate-800/40 border border-slate-700 rounded-lg p-3 hover:bg-slate-700/50 transition-colors group text-left focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded text-red-400 group-hover:scale-110 transition-transform">
              <Power size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-red-100 transition-colors">
                Manual SOS
              </div>
              <div className="text-[10px] text-slate-400">Create incident from dashboard</div>
            </div>
          </div>
          <div className="bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded text-sm border border-red-500/30 min-w-[30px] text-center">
            {triggers.power}
          </div>
        </button>

        <button
          onClick={() => fire('gesture')}
          disabled={busy}
          className="w-full flex items-center justify-between bg-slate-800/40 border border-slate-700 rounded-lg p-3 hover:bg-slate-700/50 transition-colors group text-left focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-2 rounded text-yellow-400 group-hover:scale-110 transition-transform">
              <Hand size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-yellow-100 transition-colors">
                Hand Gesture
              </div>
              <div className="text-[10px] text-slate-400">Also detected via webcam AI</div>
            </div>
          </div>
          <div className="bg-yellow-500/20 text-yellow-400 font-bold px-2 py-0.5 rounded text-sm border border-yellow-500/30 min-w-[30px] text-center">
            {triggers.gesture}
          </div>
        </button>

        <button
          onClick={() => fire('voice')}
          disabled={busy}
          className="w-full flex items-center justify-between bg-slate-800/40 border border-slate-700 rounded-lg p-3 hover:bg-slate-700/50 transition-colors group text-left focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <div className="bg-slate-700/50 p-2 rounded text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition-all">
              <Mic size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-blue-100 transition-colors">
                Audio Help
              </div>
              <div className="text-[10px] text-slate-400">Keyword path / manual test</div>
            </div>
          </div>
          <div className="bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded text-sm border border-slate-700 min-w-[30px] text-center">
            {triggers.voice}
          </div>
        </button>
      </div>
    </div>
  )
}
