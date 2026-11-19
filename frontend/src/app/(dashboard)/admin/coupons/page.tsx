
"use client";

import AdminResourcePage from "@/components/admin/AdminResourcePage";

export default function CouponsPage() {
  return (
    <AdminResourcePage
      title="Coupons & Discounts"
      description="Monitor promotional codes and discount campaigns."
      endpoint="/coupons"
      searchPlaceholder="Search coupon codes..."
      columns={[
        { key: "id", label: "Coupon ID" },
        { key: "code", label: "Coupon Code" },
        {
          key: "discountType",
          label: "Discount Type",
          render: (value) => (
            <span className="capitalize">{String(value ?? "—")}</span>
          ),
        },
        {
          key: "discountValue",
          label: "Discount Value",
          render: (value, row) =>
            row.discountType === "percentage"
              ? `${formatNumber(value)}%`
              : `₹${formatNumber(value)}`,
        },
        {
          key: "isActive",
          label: "Status",
          render: (value) => (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                value
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {value ? "Active" : "Inactive"}
            </span>
          ),
        },
        {
          key: "expiresAt",
          label: "Expires",
          render: (value) =>
            value
              ? new Date(String(value)).toLocaleDateString("en-IN")
              : "—",
        },
      ]}
    />
  );
}

function formatNumber(value: unknown) {
  return value === undefined || value === null
    ? "—"
    : Number(value).toLocaleString("en-IN");
}
