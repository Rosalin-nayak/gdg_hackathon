export default function Stats() {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-lg text-orange-400 mb-3">Stats</h2>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xl font-bold text-green-400">98%</p>
          <p className="text-xs text-gray-400">Uptime</p>
        </div>

        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xl font-bold text-red-400">4</p>
          <p className="text-xs text-gray-400">Incidents</p>
        </div>
      </div>
    </div>
  );
}