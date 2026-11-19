import { useQuery } from "@tanstack/react-query";

import { getStaffDashboard } from "./dashboard.api";

export const staffDashboardKeys = {
  all: ["staff-dashboard"] as const,
  dashboard: () => [...staffDashboardKeys.all] as const,
};

export const useStaffDashboard = () => {
  return useQuery({
    queryKey: staffDashboardKeys.dashboard(),
    queryFn: getStaffDashboard,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};