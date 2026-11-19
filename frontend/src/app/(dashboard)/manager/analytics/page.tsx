"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Analytics {
  totalRevenue?: number;
  totalOrders?: number;
  totalProducts?: number;
}

export default function ManagerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        const response = await axiosInstance.get("/analytics");
        const data = response.data.data ?? response.data;
        if (!cancelled) setAnalytics(data.analytics ?? data);
      } catch {
        if (!cancelled) setError("Unable to load analytics.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = [
    {
      title: "Revenue",
      value:
        analytics.totalRevenue === undefined
          ? "—"
          : Number(analytics.totalRevenue).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            }),
    },
    { title: "Orders", value: analytics.totalOrders ?? "—" },
    { title: "Products", value: analytics.totalProducts ?? "—" },
  ];

  return (
    <section>
      <h1 className="text-3xl font-bold">Team Analytics</h1>
      {loading && <p className="mt-6">Loading analytics...</p>}
      {error && <p role="alert" className="mt-6 text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader><CardTitle className="text-sm">{metric.title}</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{metric.value}</p></CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}