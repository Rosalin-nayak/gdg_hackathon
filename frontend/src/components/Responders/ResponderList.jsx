import React from 'react'
import { useIncidentStore } from '../../store/incidentStore'

export default function ResponderList() {
  const responders = useIncidentStore((state) => state.responders)

  return (
    <div className="panel p-4 flex-[1.2]">
      <div className="panel-header mb-3">Security Team & Dispatch</div>
      <div className="space-y-3">
        {responders.map((r) => (
          <div key={r.id} className="flex items-center justify-between cursor-pointer hover:bg-slate-800/60 p-2 -mx-2 rounded-lg transition-all border border-transparent hover:border-slate-700">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${r.bg} ${r.statusColor} border border-current/20 shadow-inner`}>
                {r.initials}
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-white tracking-wide">{r.name}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">{r.role}</div>
              </div>
            </div>
            <div className={`text-xs sm:text-sm font-bold ${r.statusColor} bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50 shadow-sm whitespace-nowrap`}>
              {r.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
