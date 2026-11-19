"use client";

import ManagerResourcePage from "@/components/manager/ManagerResourcePage";

export default function ManagerOrdersPage() {
  return (
    <ManagerResourcePage
      title="Orders"
      description="Monitor and manage customer orders."
      endpoint="/orders"
      searchPlaceholder="Search orders..."
      columns={[
        {
          key: "id",
          label: "Order ID",
        },
        {
          key: "orderNumber",
          label: "Order Number",
        },
        {
          key: "customerName",
          label: "Customer",
        },
        {
          key: "totalAmount",
          label: "Total Amount",
        },
        {
          key: "paymentStatus",
          label: "Payment Status",
        },
        {
          key: "orderStatus",
          label: "Order Status",
        },
        {
          key: "createdAt",
          label: "Order Date",
        },
      ]}
    />
  );
}