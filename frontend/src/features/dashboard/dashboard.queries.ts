import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "./dashboard.api";
import { queryKeys } from "@/lib/queryKeys";

import type { AnalyticsFilters } from "./dashboard.types";

export function useDashboard(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: dashboardApi.getDashboard,
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useAnalytics(
  filters: AnalyticsFilters = {},
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.dashboard.analytics(filters),
    queryFn: () => dashboardApi.getAnalytics(filters),
    enabled,
    staleTime: 60 * 1000,
  });
}