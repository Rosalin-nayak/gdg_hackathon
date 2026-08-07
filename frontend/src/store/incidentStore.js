import { create } from 'zustand'

export const useIncidentStore = create((set) => ({
  activeCamera: null,

  setActiveCamera: (cam) => {
    set({ activeCamera: cam });
  },

  alerts: [],

  setAlerts: (alerts) => {
    set({ alerts });
  },

  incidents: [],

  setIncidents: (incidents) =>
    set((state) => ({
      incidents,
      stats: { ...state.stats, incidents: incidents.length },
    })),

  addIncident: (incident) =>
    set((state) => {
      if (!incident?.id) return state;
      if (state.incidents.some((i) => i.id === incident.id)) return state;

      const incidents = [incident, ...state.incidents];
      const alertLabel = incident.type || 'incident';
      const alerts = state.alerts.includes(alertLabel)
        ? state.alerts
        : [...state.alerts, alertLabel];

      const zone = incident.location?.zone || incident.location || 'Unknown';

      return {
        incidents,
        alerts,
        stats: { ...state.stats, incidents: incidents.length },
        mapIncidents: [
          { id: incident.id, top: 40, left: 25, location: zone },
          ...state.mapIncidents.filter((m) => m.id !== incident.id),
        ],
      };
    }),

  updateIncident: (incident) =>
    set((state) => {
      if (!incident?.id) return state;
      return {
        incidents: state.incidents.map((i) =>
          i.id === incident.id ? { ...i, ...incident } : i
        ),
      };
    }),

  stats: {
    incidents: 0,
    uptime: 98,
    avgDetect: 1.8,
    cameras: 3,
  },

  triggers: {
    power: 3,
    gesture: 1,
    voice: 0,
  },

  confidences: {
    violence: 87,
    chasing: 72,
    fall: 44,
  },

  verifications: {
    pending: 3,
    confirmedSafe: 12,
  },

  responders: [
    { id: 1, initials: 'JD', name: 'J. Davis', role: 'Unit Alpha - Lobby', status: 'En-route', statusColor: 'text-orange-400', bg: 'bg-orange-500/20' },
    { id: 2, initials: 'MB', name: 'M. Brown', role: 'Unit Bravo - Floor 2', status: 'Available', statusColor: 'text-green-400', bg: 'bg-green-500/20' },
    { id: 3, initials: 'SR', name: 'S. Reyes', role: 'Emergency Dispatch', status: 'Active call', statusColor: 'text-red-400', bg: 'bg-red-500/20' },
    { id: 4, initials: 'KL', name: 'K. Lee', role: 'Control Room', status: 'Available', statusColor: 'text-green-400', bg: 'bg-blue-500/20' },
  ],

  mapIncidents: [],

  pipelineActive: 1,

  triggerSOS: () => {},
  triggerManualSOS: () => {},
}))
