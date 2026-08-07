import { useEffect } from "react";
import { io } from "socket.io-client";
import { useIncidentStore } from "../store/incidentStore";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

const socket = io(SOCKET_URL);

export default function useSocket() {
  const addIncident = useIncidentStore((state) => state.addIncident);
  const updateIncident = useIncidentStore((state) => state.updateIncident);

  useEffect(() => {
    socket.on("incident:new", (data) => {
      addIncident(data);
    });

    socket.on("incident:updated", (data) => {
      updateIncident(data);
    });

    return () => {
      socket.off("incident:new");
      socket.off("incident:updated");
    };
  }, [addIncident, updateIncident]);
}
