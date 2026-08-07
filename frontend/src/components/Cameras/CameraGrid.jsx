import React from "react";
import { useIncidentStore } from "../../store/incidentStore";

export default function CameraGrid() {
  const setActiveCamera = useIncidentStore((state) => state.setActiveCamera);

  const cameras = [
    { id: "CAM_01", name: "CAM-01", location: "Lobby", status: null },
    { id: "CAM_02", name: "CAM-02", location: "Entrance", status: null },
    { id: "CAM_03", name: "CAM-03", location: "Parking", status: null },
  ];

  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h2 className="text-white font-bold mb-3">CCTV Feeds</h2>

      <div className="grid grid-cols-2 gap-3">
        {cameras.map((cam) => (
          <button
            key={cam.id}
            onClick={() => {
              setActiveCamera(cam);
            }}
            className="bg-black border border-slate-700 rounded p-4 text-white hover:border-blue-500 transition"
          >
            <div className="text-sm font-bold">{cam.name}</div>
            <div className="text-xs text-slate-400">{cam.location}</div>

            {cam.status === "Alert" && (
              <div className="text-red-500 text-xs mt-1">⚠ Alert</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}