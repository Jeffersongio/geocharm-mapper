import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const customIcon = new L.DivIcon({
  html: `<div style="width:20px;height:20px;background:hsl(174,72%,56%);border-radius:50%;box-shadow:0 0 20px hsl(174,72%,56%,0.6),0 0 40px hsl(174,72%,56%,0.3);border:3px solid white;"></div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 14, { duration: 2 });
  }, [position, map]);
  return null;
}

interface MapViewProps {
  position: [number, number];
  accuracy?: number;
}

const MapView = ({ position, accuracy }: MapViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-card glow-border overflow-hidden"
      style={{ height: "450px" }}
    >
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FlyToLocation position={position} />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <span style={{ color: "#333", fontWeight: 600 }}>Você está aqui!</span>
          </Popup>
        </Marker>
        {accuracy && (
          <Circle
            center={position}
            radius={accuracy}
            pathOptions={{
              color: "hsl(174,72%,56%)",
              fillColor: "hsl(174,72%,56%)",
              fillOpacity: 0.1,
              weight: 1,
            }}
          />
        )}
      </MapContainer>
    </motion.div>
  );
};

export default MapView;
