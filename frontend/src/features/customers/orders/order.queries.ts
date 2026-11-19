import { useQuery } from "@tanstack/react-query";

import {
  getCustomerOrders,
  getCustomerOrderById,
} from "./customer-order.api";

export const customerOrderKeys = {
  all: ["customer-orders"] as const,
  list: () => [...customerOrderKeys.all, "list"] as const,
  detail: (id: number | string) =>
    [...customerOrderKeys.all, "detail", id] as const,
};

export const useCustomerOrders = () => {
  return useQuery({
    queryKey: customerOrderKeys.list(),
    queryFn: getCustomerOrders,
    staleTime: 60 * 1000,
    retry: 1,
  });
};

export const useCustomerOrder = (id: number | string) => {
  return useQuery({
    queryKey: customerOrderKeys.detail(id),
    queryFn: () => getCustomerOrderById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });
};