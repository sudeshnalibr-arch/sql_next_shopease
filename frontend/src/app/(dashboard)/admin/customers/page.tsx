
"use client";

import AdminResourcePage from "@/components/admin/AdminResourcePage";

export default function CustomersPage() {
  return (
    <AdminResourcePage
      title="Customers"
      description="View customer accounts and their account status."
      endpoint="/admin/users?role=customer"
      searchPlaceholder="Search customers by name or email..."
      columns={[
        { key: "id", label: "Customer ID" },
        { key: "name", label: "Customer Name" },
        { key: "email", label: "Email Address" },
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
          key: "createdAt",
          label: "Registered",
          render: (value) =>
            value
              ? new Date(String(value)).toLocaleDateString("en-IN")
              : "—",
        },
      ]}
    />
  );
}
