import { useQuery } from "@tanstack/react-query";

import { getStaffInventory } from "./inventory.api";

export const staffInventoryKeys = {
  all: ["staff-inventory"] as const,
  list: () => [...staffInventoryKeys.all, "list"] as const,
};

export const useStaffInventory = () => {
  return useQuery({
    queryKey: staffInventoryKeys.list(),
    queryFn: getStaffInventory,
    staleTime: 30 * 1000,
    retry: 1,
  });
};