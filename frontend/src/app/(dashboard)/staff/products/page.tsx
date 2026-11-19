"use client";

import StaffResourcePage from "@/components/staff/StaffResourcePage";

export default function StaffProductsPage() {
  return (
    <StaffResourcePage
      title="Products"
      description="View product information and stock availability."
      endpoint="/products"
      searchPlaceholder="Search products..."
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Product Name" },
        { key: "sku", label: "SKU" },
        { key: "price", label: "Price" },
        { key: "stock", label: "Available Stock" },
        { key: "isActive", label: "Status" },
      ]}
    />
  );
}