import type { UserRole } from "@/types/user.types";

export interface DashboardStats {
  totalUsers?: number;
  activeUsers?: number;
  totalProducts?: number;
  activeProducts?: number;
  totalOrders?: number;
  pendingOrders?: number;
  completedOrders?: number;
  totalRevenue?: number;
  totalStaff?: number;
  assignedOrders?: number;
}

export interface DashboardData {
  role: UserRole;
  stats: DashboardStats;
  recentOrders?: Array<{
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
  }>;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  groupBy?: "day" | "week" | "month" | "year";
}

export interface AnalyticsData {
  totalRevenue?: number;
  totalOrders?: number;
  averageOrderValue?: number;
  revenueByPeriod?: Array<{
    period: string;
    revenue: number;
  }>;
}