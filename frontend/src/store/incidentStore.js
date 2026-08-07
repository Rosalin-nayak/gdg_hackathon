import { create } from 'zustand'

const ZONE_POSITIONS = {
  Lobby: { top: 35, left: 25 },
  Entrance: { top: 30, left: 55 },
  Parking: { top: 55, left: 75 },
  Unknown: { top: 50, left: 50 },
}

const statusStyle = (status) => {
  switch (status) {
    case 'available':
      return { statusColor: 'text-green-400', bg: 'bg-green-500/20', label: 'Available' }
    case 'assigned':
    case 'dispatched':
      return { statusColor: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Assigned' }
    default:
      return { statusColor: 'text-slate-400', bg: 'bg-slate-500/20', label: status || 'Unknown' }
  }
}

const formatResponder = (r) => {
  const style = statusStyle(r.status)
  const name = r.name || 'Responder'
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return {
    id: r.id,
    name,
    initials,
    role: r.location?.zone || r.location || 'Unassigned zone',
    status: style.label,
    statusColor: style.statusColor,
    bg: style.bg,
  }
}

const mapIncidentMarker = (incident) => {
  const zone = incident.location?.zone || incident.location || 'Unknown'
  const pos = ZONE_POSITIONS[zone] || ZONE_POSITIONS.Unknown
  return {
    id: incident.id,
    top: pos.top,
    left: pos.left,
    location: zone,
  }
}

export const useIncidentStore = create((set) => ({
  activeCamera: null,
  setActiveCamera: (cam) => set({ activeCamera: cam }),

  alerts: [],
  setAlerts: (alerts) => set({ alerts }),

  incidents: [],
  responders: [],
  mapIncidents: [],

  stats: {
    incidents: 0,
    cameras: 0,
    responders: 0,
    open: 0,
  },

  pipelineActive: 0,

  setIncidents: (incidents) =>
    set((state) => ({
      incidents,
      mapIncidents: incidents.map(mapIncidentMarker),
      stats: {
        ...state.stats,
        incidents: incidents.length,
        open: incidents.filter((i) => i.status !== 'resolved').length,
      },
      pipelineActive: incidents.some((i) => i.status !== 'resolved') ? 1 : 0,
    })),

  setResponders: (responders) =>
    set((state) => ({
      responders: responders.map(formatResponder),
      stats: {
        ...state.stats,
        responders: responders.length,
      },
    })),

  setCameraCount: (count) =>
    set((state) => ({
      stats: { ...state.stats, cameras: count },
    })),

  addIncident: (incident) =>
    set((state) => {
      if (!incident?.id) return state
      if (state.incidents.some((i) => i.id === incident.id)) return state

      const incidents = [incident, ...state.incidents]
      const alertLabel = incident.type || 'incident'
      const alerts = state.alerts.includes(alertLabel)
        ? state.alerts
        : [...state.alerts, alertLabel]

      return {
        incidents,
        alerts,
        mapIncidents: [
          mapIncidentMarker(incident),
          ...state.mapIncidents.filter((m) => m.id !== incident.id),
        ],
        stats: {
          ...state.stats,
          incidents: incidents.length,
          open: incidents.filter((i) => i.status !== 'resolved').length,
        },
        pipelineActive: 1,
      }
    }),

  updateIncident: (incident) =>
    set((state) => {
      if (!incident?.id) return state
      const incidents = state.incidents.map((i) =>
        i.id === incident.id ? { ...i, ...incident } : i
      )
      return {
        incidents,
        mapIncidents: incidents.map(mapIncidentMarker),
        stats: {
          ...state.stats,
          open: incidents.filter((i) => i.status !== 'resolved').length,
        },
      }
    }),
}))
