
"use client";

import Link from "next/link";
import type { Order } from "@/types/order.types";
import { ROUTES } from "@/constants/routes";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  error?: string | null;
}

export default function OrderTable({
  orders,
  isLoading = false,
  error = null,
}: OrderTableProps) {
  if (isLoading) {
    return <p className="py-8 text-center text-muted-foreground">Loading orders...</p>;
  }

  if (error) {
    return <p role="alert" className="py-8 text-center text-red-600">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">No orders found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60">
          <tr>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Details</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3 font-medium">#{order.id}</td>
              <td className="px-4 py-3">
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </td>
              <td className="px-4 py-3">
                ₹{Number(order.totalAmount).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={ROUTES.ORDERS.DETAILS(order.id)}
                  className="font-medium text-orange-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
