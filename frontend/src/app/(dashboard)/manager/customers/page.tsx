"use client";

import ManagerResourcePage from "@/components/manager/ManagerResourcePage";

export default function ManagerCustomersPage() {
  return (
    <ManagerResourcePage
      title="Customers"
      description="View customers and their shopping activity."
      endpoint="/manager/customers"
      searchPlaceholder="Search customers..."
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "name",
          label: "Customer Name",
        },
        {
          key: "email",
          label: "Email",
        },
        {
          key: "phone",
          label: "Phone",
        },
        {
          key: "totalOrders",
          label: "Total Orders",
        },
        {
          key: "isActive",
          label: "Status",
        },
      ]}
    />
  );
}