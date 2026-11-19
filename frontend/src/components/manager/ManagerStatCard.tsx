
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface ManagerStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}

export default function ManagerStatCard({
  title,
  value,
  description,
  icon,
}: ManagerStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>

          <p className="mt-2 text-xs text-gray-500">
            {description}
          </p>
        </div>

        <div className="shrink-0 rounded-xl bg-orange-50 p-3 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
