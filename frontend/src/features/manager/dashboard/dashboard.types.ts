
export type SalesPeriod = "daily" | "weekly" | "monthly";

// Dashboard statistics
export interface ManagerDashboardStats {
  totalStaff: number;
  activeStaff: number;

  totalProducts: number;
  activeProducts: number;

  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;

  totalSales: number;
}

// Recent order information
export interface ManagerRecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

// Sales chart data
export interface SalesDataPoint {
  label: string;
  sales: number;
  orders: number;
}

// Sales overview
export interface ManagerSalesOverviewData {
  period: SalesPeriod;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  chartData: SalesDataPoint[];
}

// Complete Manager dashboard data
export interface ManagerDashboardData {
  stats: ManagerDashboardStats;
  recentOrders: ManagerRecentOrder[];
  salesOverview: ManagerSalesOverviewData;
}

// API response
export interface ManagerDashboardResponse {
  success: boolean;
  message: string;
  data: ManagerDashboardData;
}
