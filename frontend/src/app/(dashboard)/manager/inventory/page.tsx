"use client";

import ManagerResourcePage from "@/components/manager/ManagerResourcePage";

export default function ManagerInventoryPage() {
  return (
    <ManagerResourcePage
      title="Inventory"
      description="Track product stock, reserved quantities and low-stock items."
      endpoint="/manager/inventory"
      searchPlaceholder="Search inventory..."
      columns={[
        {
          key: "id",
          label: "ID",
        },
        {
          key: "productName",
          label: "Product",
        },
        {
          key: "sku",
          label: "SKU",
        },
        {
          key: "quantity",
          label: "Available Stock",
        },
        {
          key: "reservedQuantity",
          label: "Reserved",
        },
        {
          key: "lowStockThreshold",
          label: "Low Stock Limit",
        },
        {
          key: "status",
          label: "Stock Status",
        },
      ]}
    />
  );
}