
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  TrendingUp,
  ShoppingCart,
  IndianRupee,
  BarChart3,
} from "lucide-react";

import type {
  ManagerSalesOverviewData,
  SalesPeriod,
} from "@/features/manager/dashboard/dashboard.types";

interface ManagerSalesOverviewProps {
  data: ManagerSalesOverviewData;
  onPeriodChange?: (period: SalesPeriod) => void;
}

const periods: {
  label: string;
  value: SalesPeriod;
}[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

export default function ManagerSalesOverview({
  data,
  onPeriodChange,
}: ManagerSalesOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<SalesPeriod>(data.period);

  const handlePeriodChange = (period: SalesPeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const summaryCards = [
    {
      title: "Total Sales",
      value: formatCurrency(data.totalSales),
      icon: <IndianRupee size={20} />,
      description: "Revenue for selected period",
    },
    {
      title: "Total Orders",
      value: data.totalOrders.toLocaleString("en-IN"),
      icon: <ShoppingCart size={20} />,
      description: "Orders received",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(data.averageOrderValue),
      icon: <TrendingUp size={20} />,
      description: "Average revenue per order",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <BarChart3 size={20} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Sales Overview
            </h3>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Analyze your store's sales performance.
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex w-fit rounded-xl bg-gray-100 p-1">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => handlePeriodChange(period.value)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                selectedPeriod === period.value
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.08,
            }}
            className="rounded-xl bg-gray-50 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {card.title}
              </p>

              <span className="text-orange-500">
                {card.icon}
              </span>
            </div>

            <h4 className="mt-3 text-xl font-bold text-gray-900">
              {card.value}
            </h4>

            <p className="mt-1 text-xs text-gray-500">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-8">
        <div className="mb-5">
          <h4 className="font-semibold text-gray-800">
            Revenue Trend
          </h4>

          <p className="mt-1 text-xs text-gray-500">
            Sales revenue over the selected period
          </p>
        </div>

        {data.chartData.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">
              No sales data available for this period.
            </p>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="managerSalesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#F97316"
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="95%"
                      stopColor="#F97316"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                  width={75}
                />

                <Tooltip
                  formatter={(value, name) => [
                    name === "sales"
                      ? formatCurrency(Number(value))
                      : Number(value),
                    name === "sales" ? "Sales" : "Orders",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#F97316"
                  strokeWidth={3}
                  fill="url(#managerSalesGradient)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.section>
  );
}
