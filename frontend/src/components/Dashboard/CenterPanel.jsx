import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/AppContext";
import AlertFeed from "./AlertFeed";
import MapView from "./MapView";

function CenterPanel() {
  const { incident, confidence } = useContext(AppContext);
  const [responderPos, setResponderPos] = useState({ lat: 28.61, lng: 77.20 });

  useEffect(() => {
    if (incident) {
      setResponderPos({ lat: incident.lat, lng: incident.lng });
    }
  }, [incident]);

  return (
    <div className="panel">
      <div className="title">AI Detection Confidence</div>

      <p>Violence</p>
      <div className="bar" style={{ width: confidence.violence + "%" }}></div>

      <p>Chasing</p>
      <div className="bar" style={{ width: confidence.chasing + "%", background: "orange" }}></div>

      <p>Fall</p>
      <div className="bar" style={{ width: confidence.fall + "%", background: "blue" }}></div>

      <div className="title">Live Map</div>
      <MapView incident={incident} responderPos={responderPos} />

      <AlertFeed />
    </div>
  );
}

export default CenterPanel;