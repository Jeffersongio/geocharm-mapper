import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delay?: number;
}

const InfoCard = ({ icon: Icon, label, value, delay = 0 }: InfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="glass-card glow-border p-5 flex items-center gap-4 cursor-default"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground truncate">{value}</p>
      </div>
    </motion.div>
  );
};

export default InfoCard;
