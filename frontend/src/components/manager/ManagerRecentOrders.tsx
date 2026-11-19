
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  CalendarDays,
  Eye,
} from "lucide-react";

import type {
  ManagerRecentOrder,
} from "@/features/manager/dashboard/dashboard.types";

interface ManagerRecentOrdersProps {
  orders: ManagerRecentOrder[];
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default function ManagerRecentOrders({
  orders,
}: ManagerRecentOrdersProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <ShoppingBag size={19} />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Recent Orders
            </h3>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Monitor the latest customer orders.
          </p>
        </div>

        <Link
          href="/manager/orders"
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-orange-500 transition hover:text-orange-600 sm:self-auto"
        >
          View all orders
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-5 text-gray-400">
            <ShoppingBag size={30} />
          </div>

          <h4 className="font-semibold text-gray-800">
            No recent orders
          </h4>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            New customer orders will appear here when they are placed.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Order
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Customer
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Amount
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map((order, index) => {
                  const status =
                    order.orderStatus?.toLowerCase() ?? "pending";

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.05,
                      }}
                      className="transition hover:bg-orange-50/30"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-700">
                          {order.customerName}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            statusStyles[status] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {status.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/manager/orders/${order.id}`}
                          aria-label={`View order ${order.orderNumber}`}
                          className="inline-flex rounded-lg p-2 text-gray-500 transition hover:bg-orange-50 hover:text-orange-600"
                        >
                          <Eye size={18} />
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 md:hidden">
            {orders.map((order, index) => {
              const status =
                order.orderStatus?.toLowerCase() ?? "pending";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.05,
                  }}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500">
                        Order Number
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {order.orderNumber}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[status] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Customer
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {order.customerName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                      <CalendarDays size={14} />
                      {formatDate(order.createdAt)}
                    </span>

                    <Link
                      href={`/manager/orders/${order.id}`}
                      className="text-sm font-semibold text-orange-500 hover:text-orange-600"
                    >
                      View details
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.section>
  );
}
