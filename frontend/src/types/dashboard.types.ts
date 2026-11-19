
export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSales: number | string;
}

export interface RecentOrder {
  id: number;
  userId: number;
  status: string;
  totalAmount: number | string;
  createdAt: string;
}

export interface AdminDashboardData {
  role: "admin";
  stats: AdminDashboardStats;
  recentOrders: RecentOrder[];
}

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: AdminDashboardData;
}
