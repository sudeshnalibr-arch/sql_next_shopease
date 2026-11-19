"use client";

import StaffResourcePage from "@/components/staff/StaffResourcePage";

export default function StaffOrdersPage() {
  return (
    <StaffResourcePage
      title="Orders"
      description="View and process orders assigned to you."
      endpoint="/staff/orders"
      searchPlaceholder="Search orders..."
      columns={[
        { key: "id", label: "ID" },
        { key: "orderNumber", label: "Order Number" },
        { key: "customerName", label: "Customer" },
        { key: "totalAmount", label: "Total Amount" },
        { key: "paymentStatus", label: "Payment Status" },
        { key: "orderStatus", label: "Order Status" },
        { key: "createdAt", label: "Order Date" },
      ]}
    />
  );
}