
import api from "@/lib/axiosInstance";

import type {
  ManagerDashboardResponse,
  ManagerDashboardData,
} from "./dashboard.types";

/**
 * Fetch Manager dashboard data.
 *
 * Backend endpoint:
 * GET /api/dashboard/manager
 */
export const getManagerDashboard =
  async (): Promise<ManagerDashboardData> => {
    const response = await api.get<ManagerDashboardResponse>(
      "/dashboard/manager"
    );

    return response.data.data;
  };
