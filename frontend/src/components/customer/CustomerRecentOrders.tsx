import Link from "next/link";
import { ArrowRight } from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge";

import type { CustomerOrder } from "@/features/customer/orders/customer-order.types";

interface CustomerRecentOrdersProps {
  orders: CustomerOrder[];
}

export default function CustomerRecentOrders({
  orders,
}: CustomerRecentOrdersProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <div>
          <h2 className="font-semibold text-gray-900">
            Recent Orders
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Your latest purchases
          </p>
        </div>

        <Link
          href="/customer/orders"
          className="flex items-center gap-1 text-sm font-medium text-orange-600"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="p-8 text-center text-sm text-gray-500">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {order.orderNumber}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-700">
                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="font-medium text-orange-600 hover:text-orange-700"
                    >
                      Details
                    </Link>
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