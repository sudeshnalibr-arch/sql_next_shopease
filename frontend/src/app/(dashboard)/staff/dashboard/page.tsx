"use client";

import {
  ShoppingCart,
  Clock,
  PackageCheck,
  CheckCircle,
  Package,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import StaffStatCard from "@/components/staff/StaffStatCard";
import StaffRecentOrders from "@/components/staff/StaffRecentOrders";

import { useStaffDashboard } from "@/features/staff/dashboard/dashboard.queries";

export default function StaffDashboardPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useStaffDashboard();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle size={20} />
          <h2 className="font-semibold">
            Unable to load Staff dashboard
          </h2>
        </div>

        <p className="mt-2 text-sm text-red-500">
          {error instanceof Error
            ? error.message
            : "Something went wrong."}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, recentOrders } = data;

  const cards = [
    {
      title: "Assigned Orders",
      value: stats.assignedOrders,
      description: "Orders assigned to you",
      icon: ShoppingCart,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      description: "Orders awaiting processing",
      icon: Clock,
    },
    {
      title: "Processing Orders",
      value: stats.processingOrders,
      description: "Orders currently being processed",
      icon: PackageCheck,
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      description: "Orders completed",
      icon: CheckCircle,
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: "Products available to you",
      icon: Package,
    },
    {
      title: "Low Stock Products",
      value: stats.lowStockProducts,
      description: "Products requiring attention",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Staff Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome to your ShopEase workspace.
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

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Operational Overview
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <StaffStatCard
              key={card.title}
              {...card}
            />
          ))}
        </div>
      </section>

      <StaffRecentOrders orders={recentOrders ?? []} />
    </div>
  );
}