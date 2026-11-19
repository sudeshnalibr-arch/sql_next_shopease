import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { StaffRecentOrder } from "@/features/staff/dashboard/dashboard.types";

interface StaffRecentOrdersProps {
  orders: StaffRecentOrder[];
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
};

export default function StaffRecentOrders({
  orders,
}: StaffRecentOrdersProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <div>
          <h2 className="font-semibold text-gray-900">
            Recent Orders
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Latest orders available to you
          </p>
        </div>

        <Link
          href="/staff/orders"
          className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="p-8 text-center text-sm text-gray-500">
          No recent orders found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {order.orderNumber}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {order.customerName}
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyles[order.orderStatus.toLowerCase()] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}