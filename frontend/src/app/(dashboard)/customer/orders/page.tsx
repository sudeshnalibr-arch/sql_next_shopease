"use client";

import Link from "next/link";
import { useCustomerOrders } from "@/features/customers/orders/order.queries";
import OrderStatusBadge from "@/components/customer/OrderStatusBadge";
import CustomerPageHeader from "@/components/customer/CustomerPageHeader";

export default function CustomerOrdersPage() {
  const { data, isLoading, isError, refetch } = useCustomerOrders();

  if (isLoading) {
    return <p className="text-gray-500">Loading your orders...</p>;
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-5 text-red-600">
        Unable to load orders.
        <button onClick={() => refetch()} className="ml-3 underline">
          Retry
        </button>
      </div>
    );
  }

  const orders = data ?? [];

  return (
    <div>
      <CustomerPageHeader
        title="My Orders"
        description="Track and view your purchases."
      />

      {orders.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <h2 className="font-semibold text-gray-900">
            No orders yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your purchases will appear here.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  Order #{order.orderNumber}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
                <p className="mt-2 font-semibold text-gray-800">
                  ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.orderStatus} />

                <Link
                  href={`/customer/orders/${order.id}`}
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}