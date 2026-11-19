
"use client";

import AdminResourcePage from "@/components/admin/AdminResourcePage";

export default function CategoriesPage() {
  return (
    <AdminResourcePage
      title="Categories"
      description="Organize and manage your product categories."
      endpoint="/categories"
      searchPlaceholder="Search categories..."
      columns={[
        { key: "id", label: "Category ID" },
        { key: "name", label: "Category Name" },
        { key: "description", label: "Description" },
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
          label: "Created",
          render: (value) =>
            value
              ? new Date(String(value)).toLocaleDateString("en-IN")
              : "—",
        },
      ]}
    />
  );
}
