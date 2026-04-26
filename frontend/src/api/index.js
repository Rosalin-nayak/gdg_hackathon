const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
  const errorText = await res.text();
  throw new Error(`API error ${res.status}: ${errorText}`);
}
  return res.json();
};

export const getIncidents = () => api('/incidents');
// export const createIncident = (data) => api('/incidents', { method: 'POST', body: JSON.stringify(data) });

// export const getCameras = () => api('/cameras');

// export const getResponders = () => api('/responders');

// export const getAlerts = () => api('/alerts');
// export const createAlert = (data) => api('/alerts', { method: 'POST', body: JSON.stringify(data) });