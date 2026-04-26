export default function CameraCard({ camId }) {
  return (
    <div className="bg-gray-900 rounded-xl p-3 shadow hover:scale-[1.02] transition">
      
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">{camId}</span>
        <span className="text-red-400 text-xs">LIVE</span>
      </div>

      <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
        Camera Feed
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Status: Monitoring...
      </div>
    </div>
  );
}