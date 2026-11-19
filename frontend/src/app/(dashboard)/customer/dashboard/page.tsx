"use client";

import Link from "next/link";

import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Heart,
  ArrowRight,
} from "lucide-react";

import CustomerStatCard from "@/components/customer/CustomerStatCard";
import CustomerRecentOrders from "@/components/customer/CustomerRecentOrders";

import { useCustomerDashboard } from "@/features/customers/dashboard/dashboard.queries";
import { useCustomerProfile } from "@/features/customers/profile/profile.queries";

export default function CustomerDashboardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useCustomerDashboard();

  const { data: profile } = useCustomerProfile();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
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
        <p className="font-semibold text-red-700">
          Unable to load your dashboard.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, recentOrders } = data;

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: "All your purchases",
      icon: ShoppingBag,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      description: "Orders awaiting completion",
      icon: Clock,
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      description: "Successfully delivered orders",
      icon: CheckCircle,
    },
    {
      title: "Wishlist Items",
      value: stats.wishlistCount,
      description: "Products saved for later",
      icon: Heart,
    },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{profile?.name ? `, ${profile.name}` : ""}!
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your shopping activity.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <CustomerStatCard
            key={card.title}
            {...card}
          />
        ))}
      </section>

      <CustomerRecentOrders orders={recentOrders ?? []} />

      <section className="rounded-xl bg-[#171A2B] p-6 text-white sm:p-8">
        <h2 className="text-xl font-bold">
          Find something you love!
        </h2>

        <p className="mt-2 max-w-xl text-sm text-gray-300">
          Explore our latest products and discover something new.
        </p>

        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Start Shopping
          <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}