import { useQuery } from "@tanstack/react-query";

import { ordersApi } from "./order.api";
import { queryKeys } from "@/lib/queryKeys";

import type { OrderFilters } from "@/types/order.types";

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => ordersApi.getOrders(filters),
  });
}

export function useOrder(
  id: number | string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersApi.getOrder(id),
    enabled: enabled && String(id).length > 0,
  });
}