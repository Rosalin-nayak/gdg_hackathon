import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "250px",
  borderRadius: "8px",
  marginTop: "10px",
  border: "1px solid #444",
};

// Default center: Near New Delhi
const defaultCenter = {
  lat: 28.61,
  lng: 77.20,
};

function MapView({ incident, responderPos }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "", // Load from .env
  });

  if (loadError) {
    return <div style={{ color: "red", padding: "10px" }}>Error Loading Map. Please check your API Key in the .env file.</div>;
  }

  // Calculate actual center based on incident or default
  const center = incident
    ? { lat: incident.lat, lng: incident.lng }
    : defaultCenter;

  return isLoaded ? (
    <GoogleMap 
      mapContainerStyle={containerStyle} 
      center={center} 
      zoom={incident ? 15 : 12}
      options={{
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        ],
        disableDefaultUI: true
      }}
    >
      {/* Incident Marker */}
      {incident && (
        <Marker 
          position={{ lat: incident.lat, lng: incident.lng }} 
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }}
        />
      )}

      {/* Responder Marker */}
      {responderPos && (
        <Marker
          position={{ lat: responderPos.lat, lng: responderPos.lng }}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }}
        />
      )}
    </GoogleMap>
  ) : (
    <div style={{ color: "white", padding: "10px" }}>Loading Live Map...</div>
  );
}

export default React.memo(MapView);
