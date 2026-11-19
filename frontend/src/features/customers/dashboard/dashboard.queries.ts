import { useQuery } from "@tanstack/react-query";

import { getCustomerDashboard } from "./dashboard.api";

export const customerDashboardKeys = {
  all: ["customer-dashboard"] as const,
  dashboard: () => [...customerDashboardKeys.all] as const,
};

export const useCustomerDashboard = () => {
  return useQuery({
    queryKey: customerDashboardKeys.dashboard(),
    queryFn: getCustomerDashboard,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};