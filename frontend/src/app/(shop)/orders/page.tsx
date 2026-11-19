"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import type { Order } from "@/types/order.types";
import type { ApiResponse } from "@/types/api";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const response =
          await axiosInstance.get<ApiResponse<unknown>>("/orders");
        const data = response.data.data as
          | Order[]
          | { orders?: Order[]; items?: Order[] };
        if (!cancelled) {
          setOrders(
            Array.isArray(data) ? data : (data.orders ?? data.items ?? []),
          );
        }
      } catch {
        if (!cancelled) setError("Unable to load your orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>

      {loading && <p>Loading your orders...</p>}
      {error && (
        <p role="alert" className="text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-xl border p-8 text-center">
          <p>You have not placed any orders yet.</p>
          {/* <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600">
            <Link href="/products">Start shopping</Link>
          </Button> */}

          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-orange-500 text-white hover:bg-orange-600",
            )}
          >
            Start Shopping
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5"
          >
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
              <p className="mt-2 font-medium">
                {Number(order.totalAmount).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              {/* <Button asChild variant="outline">
                <Link href={`/orders/${order.id}`}>View details</Link>
              </Button> */}

              <Link
                href={`/orders/${order.id}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "cursor-pointer",
                )}
              >
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
