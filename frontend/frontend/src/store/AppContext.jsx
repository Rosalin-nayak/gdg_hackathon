import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [incident, setIncident] = useState(null);
  const [teamStatus, setTeamStatus] = useState("Idle");
  const [confidence, setConfidence] = useState({
    violence: 0,
    chasing: 0,
    fall: 0,
  });

  const playSound = () => {
    const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
    audio.play();
  };

  const triggerAlert = (msg, location = "Lobby") => {
    const newAlert = {
      text: msg,
      location,
      time: new Date().toLocaleTimeString(),
    };

    setAlerts((prev) => [newAlert, ...prev].slice(0, 6));

    // Base coordinates near a specific location (e.g. New Delhi)
    const randomLat = 28.61 + (Math.random() * 0.01);
    const randomLng = 77.20 + (Math.random() * 0.01);

    setIncident({ location, lat: randomLat, lng: randomLng });
    setTeamStatus("Dispatching...");
    playSound();

    setTimeout(() => setTeamStatus("En Route 🚓"), 2000);
  };

  // AUTO AI SIMULATION
  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence({
        violence: Math.floor(Math.random() * 100),
        chasing: Math.floor(Math.random() * 100),
        fall: Math.floor(Math.random() * 100),
      });

      const events = ["🚨 Violence", "🏃 Chasing", "⚠️ Suspicious", "🆘 SOS"];
      const locations = ["Lobby", "Parking", "Corridor", "Exit"];

      const msg = events[Math.floor(Math.random() * events.length)];
      const loc = locations[Math.floor(Math.random() * locations.length)];

      triggerAlert(msg, loc);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{ alerts, triggerAlert, incident, teamStatus, confidence }}
    >
      {children}
    </AppContext.Provider>
  );
};