"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { Users, Package, ShoppingCart, ChartNoAxesCombined } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalUsers?: number;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await axiosInstance.get("/dashboard/admin");
        const payload = response.data.data ?? response.data;
        if (!cancelled) setStats(payload.stats ?? payload);
      } catch {
        if (!cancelled) setError("Dashboard statistics could not be loaded.");
      }
    }

    void loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { title: "Users", value: stats.totalUsers ?? "—", icon: Users },
    { title: "Products", value: stats.totalProducts ?? "—", icon: Package },
    { title: "Orders", value: stats.totalOrders ?? "—", icon: ShoppingCart },
    {
      title: "Revenue",
      value:
        stats.totalRevenue === undefined
          ? "—"
          : stats.totalRevenue.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            }),
      icon: ChartNoAxesCombined,
    },
  ];

  return (
    <section>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Overview of your ShopEase store.
      </p>

      {error && <p role="alert" className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="size-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { href: "/admin/users", title: "Manage Users", description: "View users and manage account status." },
          { href: "/admin/products", title: "Manage Products", description: "Review and manage store products." },
          { href: "/admin/orders", title: "Manage Orders", description: "View customer orders." },
          { href: "/admin/analytics", title: "View Analytics", description: "Explore store performance." },
        ].map((item) => (
          <Link href={item.href} key={item.href} className="rounded-xl border p-5 transition hover:border-orange-500/50">
            <h2 className="font-semibold">{item.title} →</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}