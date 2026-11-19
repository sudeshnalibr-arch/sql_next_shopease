
"use client";

import AdminResourcePage from "@/components/admin/AdminResourcePage";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function OrdersPage() {
  return (
    <AdminResourcePage
      title="Orders"
      description="Monitor customer orders and track order processing."
      endpoint="/orders"
      searchPlaceholder="Search orders..."
      columns={[
        { key: "id", label: "Order ID" },
        { key: "userId", label: "Customer ID" },
        {
          key: "totalAmount",
          label: "Order Amount",
          render: (value) =>
            value !== undefined
              ? `₹${Number(value).toLocaleString("en-IN")}`
              : "—",
        },
        {
          key: "status",
          label: "Order Status",
          render: (value) => {
            const status = String(value ?? "").toLowerCase();

            return (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[status] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {status || "Unknown"}
              </span>
            );
          },
        },
        {
          key: "createdAt",
          label: "Order Date",
          render: (value) =>
            value
              ? new Date(String(value)).toLocaleDateString("en-IN")
              : "—",
        },
      ]}
    />
  );
}
