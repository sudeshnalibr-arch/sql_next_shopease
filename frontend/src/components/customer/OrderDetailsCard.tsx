import OrderStatusBadge from "./OrderStatusBadge";

import type { CustomerOrder } from "@/features/customer/orders/customer-order.types";

interface OrderDetailsCardProps {
  order: CustomerOrder;
}

export default function OrderDetailsCard({
  order,
}: OrderDetailsCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-5">
        <div>
          <h2 className="font-semibold text-gray-900">
            Order #{order.orderNumber}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>

        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500">Total amount</p>
          <p className="mt-1 text-lg font-bold text-gray-900">
            ₹{Number(order.totalAmount).toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Payment status</p>
          <p className="mt-1 font-semibold capitalize text-gray-900">
            {order.paymentStatus}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t pt-5">
        <h3 className="mb-3 font-semibold text-gray-900">
          Items
        </h3>

        <div className="space-y-3">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {item.productName}
                </p>
                <p className="text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-semibold text-gray-800">
                ₹{Number(item.subtotal).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}