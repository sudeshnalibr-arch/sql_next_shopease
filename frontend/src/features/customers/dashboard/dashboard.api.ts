import api from "@/lib/axiosInstance";

import type {
  CustomerDashboardData,
  CustomerDashboardResponse,
} from "./dashboard.types";

export const getCustomerDashboard =
  async (): Promise<CustomerDashboardData> => {
    const response = await api.get<CustomerDashboardResponse>(
      "/dashboard/customer"
    );

    return response.data.data;
  };