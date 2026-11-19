
"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OrdersChartProps {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function OrdersChart({
  totalOrders,
  pendingOrders,
  completedOrders,
}: OrdersChartProps) {
  const otherOrders = Math.max(
    0,
    totalOrders - pendingOrders - completedOrders
  );

  const chartData = [
    { name: "Pending", orders: pendingOrders },
    { name: "Completed", orders: completedOrders },
    { name: "Other", orders: otherOrders },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Order Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Current order status distribution
        </p>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />

            <Tooltip
              cursor={{ fill: "#FFF7ED" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
              }}
            />

            <Bar
              dataKey="orders"
              name="Orders"
              fill="#F97316"
              radius={[7, 7, 0, 0]}
              barSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
