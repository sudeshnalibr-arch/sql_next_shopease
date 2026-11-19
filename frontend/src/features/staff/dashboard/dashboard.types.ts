export interface StaffDashboardStats {
  assignedOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalProducts: number;
  lowStockProducts: number;
}

export interface StaffRecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

export interface StaffDashboardData {
  stats: StaffDashboardStats;
  recentOrders: StaffRecentOrder[];
}

export interface StaffDashboardResponse {
  success: boolean;
  message: string;
  data: StaffDashboardData;
}