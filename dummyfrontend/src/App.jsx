import Navbar from "./components/Navbar";
import CameraCard from "./components/CameraCard";
import AlertPanel from "./components/AlertPanel";
import Stats from "./components/Stats";

export default function App() {
  const cameras = ["CAM-01", "CAM-02", "CAM-03", "CAM-04"];

  return (
    <div className="min-h-screen p-4">
      <Navbar />

      <div className="grid lg:grid-cols-3 gap-4 mt-4">    
        
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {cameras.map((cam) => (
            <CameraCard key={cam} camId={cam} />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Stats />
          <AlertPanel />
        </div>
      </div>
    </div>
  );
}
