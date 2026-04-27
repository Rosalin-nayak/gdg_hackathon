import React, { useEffect, useRef } from "react";
import { useIncidentStore } from "../../store/incidentStore";

export default function CameraFeed() {
  const { activeCamera, setActiveCamera } = useIncidentStore();

  // ✅ FIX: get setAlerts at top level (hook safe)
  const setAlerts = useIncidentStore((state) => state.setAlerts);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 🎥 Start camera
  useEffect(() => {
    if (!activeCamera) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        console.log("✅ Camera started");

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("❌ Camera error:", err));
  }, [activeCamera]);

  // 🔥 Send frames to backend
  useEffect(() => {
    if (!activeCamera) return;

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
          const res = await fetch("http://localhost:4000/detect", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          console.log("🔥 ML RESULT:", data);

          // ✅ UPDATE ALERTS
          if (data.alerts && data.alerts.length > 0) {
            console.log("🚨 ALERT RECEIVED:", data.alerts);
            setAlerts(data.alerts);
          }

        } catch (err) {
          console.error("❌ ML error:", err);
        }
      }, "image/jpeg");
    }, 3000);

    return () => clearInterval(interval);
  }, [activeCamera, setAlerts]);

  if (!activeCamera) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <button
        onClick={() => setActiveCamera(null)}
        style={{ marginBottom: "10px", padding: "10px" }}
      >
        Close
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "80%", maxWidth: "600px" }}
      />

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}