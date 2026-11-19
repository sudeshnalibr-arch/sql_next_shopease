
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/lib/axiosInstance";
import type {
  AdminDashboardResponse,
} from "@/types/dashboard.types";

const fetchAdminDashboard = async () => {
  const response = await axiosInstance.get<AdminDashboardResponse>(
    "/dashboard"
  );

  return response.data.data;
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
