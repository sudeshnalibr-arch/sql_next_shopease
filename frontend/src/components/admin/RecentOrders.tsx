
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { RecentOrder } from "@/types/dashboard.types";

interface RecentOrdersProps {
  orders: RecentOrder[];
}

const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Recent Orders
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Latest orders placed in your store
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-400"
                >
                  No orders available.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.06 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    #{order.id}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    #{order.userId}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {formatCurrency(order.totalAmount)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-700">
                      {order.status}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
