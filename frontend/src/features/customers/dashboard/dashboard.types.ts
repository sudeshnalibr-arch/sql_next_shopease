import type { CustomerOrder } from "../orders/customer-order.types";

export interface CustomerDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  wishlistCount: number;
}

export interface CustomerDashboardData {
  stats: CustomerDashboardStats;
  recentOrders: CustomerOrder[];
}

export interface CustomerDashboardResponse {
  success: boolean;
  message: string;
  data: CustomerDashboardData;
}