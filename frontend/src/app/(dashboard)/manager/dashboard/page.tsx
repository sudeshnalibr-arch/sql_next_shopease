"use client";

import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  Clock,
  CheckCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import ManagerStatCard from "@/components/manager/ManagerStatCard";
import ManagerRecentOrders from "@/components/manager/ManagerRecentOrders";
import ManagerSalesOverview from "@/components/manager/ManagerSalesOverview";

import { useManagerDashboard } from "@/features/manager/dashboard/dashboard.queries";

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-56 rounded bg-gray-200" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl bg-gray-200"
          />
        ))}
      </div>

      <div className="h-80 rounded-xl bg-gray-200" />
      <div className="h-72 rounded-xl bg-gray-200" />
    </div>
  );
}

export default function ManagerDashboardPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useManagerDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle size={22} />

          <h2 className="font-semibold">
            Unable to load dashboard
          </h2>
        </div>

        <p className="mt-2 text-sm text-red-500">
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading dashboard data."}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  const { stats, recentOrders, salesOverview } = data;

  const statCards = [
    {
      title: "Total Staff",
      value: stats.totalStaff,
      description: `${stats.activeStaff} active staff members`,
      icon: Users,
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: `${stats.activeProducts} active products`,
      icon: Package,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: "Orders under your management",
      icon: ShoppingCart,
    },
    {
      title: "Total Sales",
      value: `₹${Number(stats.totalSales).toLocaleString("en-IN")}`,
      description: "Total sales",
      icon: IndianRupee,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      description: "Orders waiting for processing",
      icon: Clock,
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      description: "Successfully completed orders",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manager Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor your team, products, orders and sales.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((stat) => (
            <ManagerStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
            />
          ))}
        </div>
      </section>

      {/* Sales overview */}
      {salesOverview && (
        <section>
          <ManagerSalesOverview data={salesOverview} />
        </section>
      )}

      {/* Recent orders */}
      <section>
        <ManagerRecentOrders orders={recentOrders ?? []} />
      </section>
    </div>
  );
}