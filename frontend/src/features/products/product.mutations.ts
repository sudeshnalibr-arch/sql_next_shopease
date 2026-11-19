import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { productsApi } from "./product.api";
import { queryKeys } from "@/lib/queryKeys";

import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product.types.";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) =>
      productsApi.createProduct(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.products.lists(),
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number | string;
      input: UpdateProductInput;
    }) => productsApi.updateProduct(id, input),

    onSuccess: async (product) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.detail(product.id),
        }),
      ]);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      productsApi.deleteProduct(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },
  });
}