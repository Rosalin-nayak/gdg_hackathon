import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "10px",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};

export default function GoogleMapView({ incidents = [] }) {
  return (
    <div className="panel p-4">
      <div className="panel-header mb-2">Google Map (Live Alerts)</div>

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={15}
        >
          {incidents.map((incident, index) => (
            <Marker
              key={index}
              position={{
                lat: incident?.location?.lat || defaultCenter.lat,
                lng: incident?.location?.lng || defaultCenter.lng,
              }}
              label="🚨"
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}