"use client";

import StaffResourcePage from "@/components/staff/StaffResourcePage";

export default function StaffInventoryPage() {
  return (
    <StaffResourcePage
      title="Inventory"
      description="Monitor product stock and identify low-stock products."
      endpoint="/staff/inventory"
      searchPlaceholder="Search inventory..."
      columns={[
        { key: "id", label: "ID" },
        { key: "productName", label: "Product" },
        { key: "sku", label: "SKU" },
        { key: "quantity", label: "Quantity" },
        { key: "reservedQuantity", label: "Reserved" },
        { key: "lowStockThreshold", label: "Low Stock Limit" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}