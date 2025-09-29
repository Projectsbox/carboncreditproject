import { motion } from 'framer-motion';

type StatCardProps = {
  label: string;
  value: string | number;
  delay?: number;
};

export function StatCard({ label, value, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-5 shadow border border-white/10"
    >
      <div className="text-sm text-slate-400">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </motion.div>
  );
}


