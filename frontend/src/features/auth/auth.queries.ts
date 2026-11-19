import { useQuery } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import { queryKeys } from "@/lib/queryKeys";

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.getCurrentUser,
    enabled,
    retry: false,
    staleTime: 60 * 1000,
  });
}