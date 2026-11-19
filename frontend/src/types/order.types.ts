export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  userId?: number;
}

export interface OrderListResponse {
  orders: Order[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}