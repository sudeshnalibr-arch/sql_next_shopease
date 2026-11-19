"use client";

import ManagerResourcePage from "@/components/manager/ManagerResourcePage";

export default function ManagerProductsPage() {
  return (
    <ManagerResourcePage
      title="Products"
      description="View and manage products assigned to your store."
      endpoint="/products"
      searchPlaceholder="Search products..."
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "name",
          label: "Product Name",
        },
        {
          key: "sku",
          label: "SKU",
        },
        {
          key: "price",
          label: "Price",
        },
        {
          key: "stock",
          label: "Stock",
        },
        {
          key: "isActive",
          label: "Status",
        },
      ]}
    />
  );
}