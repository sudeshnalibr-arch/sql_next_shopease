import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

import type {
  DashboardData,
  AnalyticsData,
  AnalyticsFilters,
} from "./dashboard.types";

export const dashboardApi = {
  async getDashboard(): Promise<DashboardData> {
    const response = await axiosInstance.get<
      ApiResponse<DashboardData>
    >("/dashboard");

    return response.data.data;
  },

  async getAnalytics(
    filters: AnalyticsFilters = {},
  ): Promise<AnalyticsData> {
    const response = await axiosInstance.get<
      ApiResponse<AnalyticsData>
    >("/dashboard/analytics", {
      params: filters,
    });

    return response.data.data;
  },
};