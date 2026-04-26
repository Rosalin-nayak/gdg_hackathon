import { create } from 'zustand'

export const useIncidentStore = create((set) => ({
  stats: {
    incidents: 4,
    uptime: 98,
    avgDetect: 1.8,
    cameras: 12
  },
  triggers: {
    power: 3,
    gesture: 1,
    voice: 0
  },
  confidences: {
    violence: 87,
    chasing: 72,
    fall: 44
  },
  verifications: {
    pending: 3,
    confirmedSafe: 12
  },
  responders: [
    { id: 1, initials: 'JD', name: 'J. Davis', role: 'Unit Alpha - Lobby', status: 'En-route', statusColor: 'text-orange-400', bg: 'bg-orange-500/20' },
    { id: 2, initials: 'MB', name: 'M. Brown', role: 'Unit Bravo - Floor 2', status: 'Available', statusColor: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 3, initials: 'SR', name: 'S. Reyes', role: 'Emergency Dispatch', status: 'Active call', statusColor: 'text-red-400', bg: 'bg-red-500/20' },
    { id: 4, initials: 'KL', name: 'K. Lee', role: 'Control Room', status: 'Available', statusColor: 'text-green-400', bg: 'bg-blue-500/20' }
  ],
  mapIncidents: [
    { id: 1, top: 40, left: 25, location: 'Lobby' }
  ],
  pipelineActive: 1, // 0: AI, 1: SOS, 2: Verify, 3: Respond

  activeCamera: null, // New state for selected camera

  // Actions
  setActiveCamera: (cam) => set({ activeCamera: cam }),

  triggerSOS: (type) => set((state) => {
    const newTriggers = { ...state.triggers }
    newTriggers[type] += 1
    
    const newIncidentId = Date.now()
    const newMapIncident = {
      id: newIncidentId,
      top: 20 + Math.random() * 60,
      left: 20 + Math.random() * 60,
      location: type.toUpperCase()
    }

    return {
      triggers: newTriggers,
      stats: { ...state.stats, incidents: state.stats.incidents + 1 },
      verifications: { ...state.verifications, pending: state.verifications.pending + 1 },
      mapIncidents: [...state.mapIncidents, newMapIncident],
      pipelineActive: 2
    }
  }),

  triggerManualSOS: () => set((state) => {
    const newMapIncident = {
      id: Date.now(),
      top: 50,
      left: 50,
      location: 'MANUAL SOS'
    }
    
    const updatedResponders = [...state.responders]
    updatedResponders[1] = { ...updatedResponders[1], status: 'Dispatched', statusColor: 'text-red-400', bg: 'bg-red-500/20' }

    return {
      stats: { ...state.stats, incidents: state.stats.incidents + 1 },
      mapIncidents: [...state.mapIncidents, newMapIncident],
      pipelineActive: 3,
      responders: updatedResponders
    }
  })
}))
