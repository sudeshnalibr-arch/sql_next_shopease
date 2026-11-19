import api from "@/lib/axiosInstance";

import type {
  StaffDashboardData,
  StaffDashboardResponse,
} from "./dashboard.types";

export const getStaffDashboard =
  async (): Promise<StaffDashboardData> => {
    const response = await api.get<StaffDashboardResponse>(
      "/dashboard/staff"
    );

    return response.data.data;
  };