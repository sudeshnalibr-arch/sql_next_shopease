export interface StaffInventoryItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export interface StaffInventoryResponse {
  success: boolean;
  message: string;
  data: StaffInventoryItem[];
}