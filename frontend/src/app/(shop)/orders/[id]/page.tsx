"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import type { Order } from "@/types/order.types";
import type { ApiResponse } from "@/types/api";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        const response = await axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);
        if (!cancelled) setOrder(response.data.data);
      } catch {
        if (!cancelled) setError("Order not found or access denied.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadOrder();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <main className="p-10">Loading order...</main>;
  if (error || !order) {
    return <main role="alert" className="p-10 text-red-500">{error || "Order not found."}</main>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/orders" className="text-sm text-orange-500 hover:underline">
        ← Back to orders
      </Link>

      <div className="mt-5 rounded-xl border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-6 border-t pt-5">
          <h2 className="font-semibold">Items</h2>

          {order.items?.length ? (
            <div className="mt-4 space-y-3">
              {order.items.map((item, index) => (
                <div key={item.id ?? `${item.productId}-${index}`} className="flex justify-between gap-4 text-sm">
                  <span>{item.productName ?? `Product #${item.productId}`} × {item.quantity}</span>
                  <span>
                    {Number(item.subtotal ?? item.price * item.quantity).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Item details were not included in the API response.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-between border-t pt-5 text-lg font-bold">
          <span>Order total</span>
          <span>
            {Number(order.totalAmount).toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
        </div>
      </div>
    </main>
  );
}