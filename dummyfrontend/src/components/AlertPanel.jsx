export default function AlertPanel() {
  const alerts = [
    { type: "Fall Detected", cam: "CAM-01" },
    { type: "Crowd Detected", cam: "CAM-02" },
  ];

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-lg mb-3 text-orange-400">Alerts</h2>

      <div className="space-y-2">
        {alerts.map((a, i) => (
          <div
            key={i}
            className="bg-gray-800 p-2 rounded flex justify-between"
          >
            <span>{a.type}</span>
            <span className="text-xs text-gray-400">{a.cam}</span>
          </div>
        ))}
      </div>
    </div>
  );
}