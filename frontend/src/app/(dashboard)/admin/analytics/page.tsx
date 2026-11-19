"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsData {
  totalRevenue?: number;
  totalOrders?: number;
  totalUsers?: number;
  totalProducts?: number;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        const response = await axiosInstance.get("/analytics");
        const payload = response.data.data ?? response.data;
        if (!cancelled) setData(payload.analytics ?? payload);
      } catch {
        if (!cancelled) setError("Unable to load analytics. Check your API endpoint.");
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
    ["Revenue", data.totalRevenue, true],
    ["Orders", data.totalOrders, false],
    ["Users", data.totalUsers, false],
    ["Products", data.totalProducts, false],
  ] as const;

  return (
    <section>
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="mt-2 text-muted-foreground">Store performance overview.</p>

      {loading && <p className="mt-6">Loading analytics...</p>}
      {error && <p role="alert" className="mt-6 text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([title, value, isCurrency]) => (
            <Card key={title}>
              <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {value === undefined
                    ? "—"
                    : isCurrency
                      ? Number(value).toLocaleString("en-IN", { style: "currency", currency: "INR" })
                      : value.toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}