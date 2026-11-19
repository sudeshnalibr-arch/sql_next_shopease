
"use client";

import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  UserCheck,
  Clock3,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import StatCard from "@/components/admin/StatCard";
import OrdersChart from "@/components/admin/OrdersChart";
import RecentOrders from "@/components/admin/RecentOrders";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-64 animate-pulse rounded-xl bg-gray-200" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
        <h2 className="text-lg font-bold text-gray-900">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading dashboard data."}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Try again
        </button>
      </div>
    );
  }

  const stats = data.stats;

  const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalSales),
      description: "From delivered orders",
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString("en-IN"),
      description: "Orders placed in your store",
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString("en-IN"),
      description: `${stats.activeProducts} active products`,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Customers & Users",
      value: stats.totalUsers.toLocaleString("en-IN"),
      description: `${stats.activeUsers} active accounts`,
      icon: Users,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const secondaryCards = [
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock3,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Dashboard Overview
          </motion.h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor your store performance and business activities.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Main statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <StatCard
            key={card.title}
            {...card}
            delay={index * 0.08}
          />
        ))}
      </div>

      {/* Secondary statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        {secondaryCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className={`rounded-xl p-3 ${card.color}`}>
                <Icon size={22} />
              </div>

              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {card.value.toLocaleString("en-IN")}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <OrdersChart
        totalOrders={stats.totalOrders}
        pendingOrders={stats.pendingOrders}
        completedOrders={stats.completedOrders}
      />

      {/* Recent orders */}
      <RecentOrders orders={data.recentOrders ?? []} />
    </div>
  );
}
