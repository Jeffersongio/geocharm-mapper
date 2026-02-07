import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const primaryIcon = new L.DivIcon({
  html: `<div style="width:20px;height:20px;background:hsl(174,72%,56%);border-radius:50%;box-shadow:0 0 20px hsl(174,72%,56%,0.6),0 0 40px hsl(174,72%,56%,0.3);border:3px solid white;"></div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const clickedIcon = new L.DivIcon({
  html: `<div style="width:18px;height:18px;background:hsl(265,70%,65%);border-radius:50%;box-shadow:0 0 16px hsl(265,70%,65%,0.6),0 0 32px hsl(265,70%,65%,0.3);border:3px solid white;"></div>`,
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 14, { duration: 2 });
  }, [position, map]);
  return null;
}

function ClickHandler({ onMapClick }: { onMapClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

function MapSearch({ onSelect }: { onSelect: (pos: [number, number]) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    }
    setSearching(false);
  }, [query]);

  return (
    <div className="absolute top-3 left-3 right-3 z-[1000]">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Buscar endereço..."
            className="w-full rounded-xl border border-[hsl(var(--geo-glass-border))] bg-[hsl(var(--geo-glass)/0.9)] px-4 py-2.5 pl-10 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] backdrop-blur-xl outline-none focus:border-[hsl(var(--primary)/0.5)] focus:ring-1 focus:ring-[hsl(var(--primary)/0.3)]"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          {query && (
            <button
              onClick={() => { setQuery(""); setResults([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={search}
          disabled={searching}
          className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {searching ? "..." : "Buscar"}
        </button>
      </div>
      {results.length > 0 && (
        <ul className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-[hsl(var(--geo-glass-border))] bg-[hsl(var(--geo-glass)/0.95)] backdrop-blur-xl">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => {
                onSelect([parseFloat(r.lat), parseFloat(r.lon)]);
                setResults([]);
                setQuery(r.display_name.split(",").slice(0, 2).join(","));
              }}
              className="cursor-pointer border-b border-[hsl(var(--border)/0.5)] px-4 py-2.5 text-xs text-[hsl(var(--foreground))] transition-colors last:border-0 hover:bg-[hsl(var(--primary)/0.1)]"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface MapViewProps {
  position: [number, number];
  accuracy?: number;
}

const MapView = ({ position, accuracy }: MapViewProps) => {
  const [clickedPos, setClickedPos] = useState<[number, number] | null>(null);
  const [searchPos, setSearchPos] = useState<[number, number] | null>(null);
  const flyTarget = searchPos || position;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-card glow-border overflow-hidden relative"
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
        <FlyToLocation position={flyTarget} />
        <ClickHandler onMapClick={setClickedPos} />

        {/* User location marker */}
        <Marker position={position} icon={primaryIcon}>
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

        {/* Clicked marker with 50m radius */}
        {clickedPos && (
          <>
            <Marker position={clickedPos} icon={clickedIcon}>
              <Popup>
                <span style={{ color: "#333", fontWeight: 600 }}>
                  {clickedPos[0].toFixed(6)}, {clickedPos[1].toFixed(6)}
                </span>
              </Popup>
            </Marker>
            <Circle
              center={clickedPos}
              radius={50}
              pathOptions={{
                color: "hsl(265,70%,65%)",
                fillColor: "hsl(265,70%,65%)",
                fillOpacity: 0.15,
                weight: 2,
              }}
            />
          </>
        )}

        {/* Search marker */}
        {searchPos && (
          <Marker position={searchPos} icon={primaryIcon}>
            <Popup>
              <span style={{ color: "#333", fontWeight: 600 }}>Local buscado</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <MapSearch onSelect={(pos) => { setSearchPos(pos); setClickedPos(null); }} />
    </motion.div>
  );
};

export default MapView;
