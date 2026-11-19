"use client";

import StaffResourcePage from "@/components/staff/StaffResourcePage";

export default function StaffCustomersPage() {
  return (
    <StaffResourcePage
      title="Customers"
      description="View customer information required for order processing."
      endpoint="/staff/customers"
      searchPlaceholder="Search customers..."
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Customer Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "totalOrders", label: "Total Orders" },
        { key: "createdAt", label: "Joined Date" },
      ]}
    />
  );
}