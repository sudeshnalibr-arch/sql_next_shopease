import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { ordersApi } from "./order.api";
import { queryKeys } from "@/lib/queryKeys";

import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "@/types/order.types";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) =>
      ordersApi.createOrder(input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.all,
        }),
      ]);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number | string;
      input: UpdateOrderStatusInput;
    }) => ordersApi.updateOrderStatus(id, input),

    onSuccess: async (order) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.orders.detail(order.id),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.all,
        }),
      ]);
    },
  });
}