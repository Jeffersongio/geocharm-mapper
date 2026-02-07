import { motion } from "framer-motion";

const GeoBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Gradient orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(174,72%,56%) 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, hsl(265,70%,65%) 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/3 h-[300px] w-[300px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(215,90%,60%) 0%, transparent 70%)" }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(174,72%,56%) 1px, transparent 1px), linear-gradient(90deg, hsl(174,72%,56%) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

export default GeoBackground;
