
import { useQuery } from "@tanstack/react-query";

import { getManagerDashboard } from "./dashboard.api";

export const managerDashboardKeys = {
  all: ["manager-dashboard"] as const,
  dashboard: () => [...managerDashboardKeys.all] as const,
};

export const useManagerDashboard = () => {
  return useQuery({
    queryKey: managerDashboardKeys.dashboard(),
    queryFn: getManagerDashboard,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};
