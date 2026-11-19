export interface CustomerOrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CustomerOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items?: CustomerOrderItem[];
}

export interface CustomerOrdersResponse {
  success: boolean;
  message: string;
  data: CustomerOrder[];
}

export interface CustomerOrderResponse {
  success: boolean;
  message: string;
  data: CustomerOrder;
}