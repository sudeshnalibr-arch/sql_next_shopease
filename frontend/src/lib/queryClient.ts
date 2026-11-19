
import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cached data stays fresh for one minute.
        staleTime: 60 * 1000,

        // Retry failed queries once.
        retry: 1,

        // Avoid unnecessary refetching on window focus.
        refetchOnWindowFocus: false,
      },

      mutations: {
        // Avoid automatically repeating create/update requests.
        retry: 0,
      },
    },
  });
}
