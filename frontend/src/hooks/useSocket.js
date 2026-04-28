import { useEffect } from "react";
import { io } from "socket.io-client";
import { useIncidentStore } from "../store/incidentStore";

const socket = io(import.meta.env.VITE_SOCKET_URL);

export default function useSocket() {
  const addIncident = useIncidentStore((state) => state.addIncident);

  useEffect(() => {
    socket.on("new_incident", (data) => {
      addIncident(data);
    });

    return () => {
      socket.off("new_incident");
    };
  }, [addIncident]);
}