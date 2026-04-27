import { create } from 'zustand'

export const useIncidentStore = create((set) => ({
  
  
  activeCamera: null,

  setActiveCamera: (cam) => {
    console.log("SETTING CAMERA:", cam);
    set({ activeCamera: cam });
  },

  alerts: [],

  setAlerts: (alerts) => {
    console.log("SETTING ALERTS:", alerts);
    set({ alerts });
  },

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

  pipelineActive: 1,

  triggerSOS: () => {},
  triggerManualSOS: () => {}

}))