
import Link from "next/link";
import type { Order } from "@/types/order.types";
import { ROUTES } from "@/constants/routes";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

interface RecentOrdersProps {
  orders: Order[];
  isLoading?: boolean;
}

export default function RecentOrders({
  orders,
  isLoading = false,
}: RecentOrdersProps) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Recent orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest orders in your account
          </p>
        </div>

        <Link
          href={ROUTES.ORDERS.LIST}
          className="text-sm font-medium text-orange-600 hover:underline"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading orders...
        </p>
      ) : orders.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No recent orders.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-3 border-b pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  href={ROUTES.ORDERS.DETAILS(order.id)}
                  className="font-medium hover:text-orange-600"
                >
                  Order #{order.id}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="font-semibold">
                  ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
