export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl shadow">
      <h1 className="text-xl font-bold text-orange-400">
        Sentinel AI 🚨
      </h1>

      <div className="text-green-400 text-sm">
        ● System Active
      </div>
    </div>
  );
}