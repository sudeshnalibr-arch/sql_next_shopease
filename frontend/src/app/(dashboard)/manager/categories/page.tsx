"use client";

import ManagerResourcePage from "@/components/manager/ManagerResourcePage";

export default function ManagerCategoriesPage() {
  return (
    <ManagerResourcePage
      title="Categories"
      description="View and manage product categories."
      endpoint="/categories"
      searchPlaceholder="Search categories..."
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "name",
          label: "Category Name",
        },
        {
          key: "description",
          label: "Description",
        },
        {
          key: "isActive",
          label: "Status",
        },
        {
          key: "createdAt",
          label: "Created At",
        },
      ]}
    />
  );
}