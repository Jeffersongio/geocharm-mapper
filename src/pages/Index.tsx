import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Globe,
  Compass,
  Target,
  Zap,
  Loader2,
  LocateFixed,
} from "lucide-react";
import MapView from "@/components/MapView";
import InfoCard from "@/components/InfoCard";
import GeoBackground from "@/components/GeoBackground";

interface GeoData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

const Index = () => {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoData({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          timestamp: pos.timestamp,
        });
        setLoading(false);
      },
      (err) => {
        setError("Permissão negada ou erro ao obter localização.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const formatCoord = (val: number, type: "lat" | "lng") => {
    const dir = type === "lat" ? (val >= 0 ? "N" : "S") : val >= 0 ? "E" : "W";
    return `${Math.abs(val).toFixed(6)}° ${dir}`;
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GeoBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 glow-border"
          >
            <Globe className="h-10 w-10 text-primary" />
          </motion.div>

          <h1 className="mb-3 text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="gradient-text">Geo</span>
            <span className="text-foreground">localização</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground">
            Descubra sua posição no mundo em tempo real com precisão e estilo.
          </p>
        </motion.header>

        {/* Explanation Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-12 mx-auto max-w-3xl"
        >
          <div className="glass-card p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              O que é Geolocalização?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Geolocalização</strong> é a tecnologia que permite identificar a 
              posição geográfica de um dispositivo (como seu celular ou computador) no mundo real. Ela utiliza 
              dados de <strong className="text-foreground">GPS</strong>, redes Wi-Fi, torres de celular e até o 
              endereço IP para calcular sua latitude e longitude com precisão.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  title: "GPS",
                  desc: "Satélites orbitando a Terra enviam sinais que seu dispositivo usa para triangular sua posição exata.",
                },
                {
                  icon: Zap,
                  title: "Wi-Fi & Redes",
                  desc: "Redes Wi-Fi e torres de celular próximas ajudam a estimar sua localização em áreas urbanas.",
                },
                {
                  icon: Globe,
                  title: "Aplicações",
                  desc: "Mapas, delivery, clima, redes sociais e segurança — a geolocalização está em todo lugar.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                  className="rounded-xl bg-secondary/50 p-4 space-y-2"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground border-t border-border pt-4">
              💡 Clique no botão abaixo para ver a geolocalização em ação — seu navegador pedirá permissão 
              para acessar sua localização.
            </p>
          </div>
        </motion.section>

        {/* CTA Button */}
        {!geoData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12 flex justify-center"
          >
            <motion.button
              onClick={requestLocation}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-[0_0_40px_hsl(174,72%,56%,0.4)] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <LocateFixed className="h-6 w-6 transition-transform group-hover:rotate-45" />
              )}
              {loading ? "Localizando..." : "Obter Minha Localização"}
            </motion.button>
          </motion.div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 glass-card mx-auto max-w-md border-destructive/30 p-4 text-center text-destructive"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence>
          {geoData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Map */}
              <div className="mb-8">
                <MapView
                  position={[geoData.latitude, geoData.longitude]}
                  accuracy={geoData.accuracy}
                />
              </div>

              {/* Info Grid */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  icon={MapPin}
                  label="Latitude"
                  value={formatCoord(geoData.latitude, "lat")}
                  delay={0.1}
                />
                <InfoCard
                  icon={Navigation}
                  label="Longitude"
                  value={formatCoord(geoData.longitude, "lng")}
                  delay={0.2}
                />
                <InfoCard
                  icon={Target}
                  label="Precisão"
                  value={`± ${geoData.accuracy.toFixed(0)} metros`}
                  delay={0.3}
                />
                <InfoCard
                  icon={Compass}
                  label="Altitude"
                  value={geoData.altitude ? `${geoData.altitude.toFixed(1)} m` : "Indisponível"}
                  delay={0.4}
                />
                <InfoCard
                  icon={Zap}
                  label="Velocidade"
                  value={geoData.speed ? `${(geoData.speed * 3.6).toFixed(1)} km/h` : "Parado"}
                  delay={0.5}
                />
                <InfoCard
                  icon={Globe}
                  label="Timestamp"
                  value={new Date(geoData.timestamp).toLocaleTimeString("pt-BR")}
                  delay={0.6}
                />
              </div>

              {/* Refresh */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center"
              >
                <motion.button
                  onClick={requestLocation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
                >
                  <LocateFixed className="h-4 w-4" />
                  Atualizar Localização
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
