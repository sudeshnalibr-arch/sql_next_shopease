// import { useQuery } from "@tanstack/react-query";

// import { productsApi } from "./product.api";
// import { queryKeys } from "@/lib/queryKeys";

// import type { ProductFilters } from "@/types/product.types.";

// export function useProducts(filters: ProductFilters = {}) {
//   return useQuery({
//     queryKey: queryKeys.products.list(filters),
//     queryFn: () => productsApi.getProducts(filters),
//   });
// }

// export function useProduct(
//   id: number | string,
//   enabled = true,
// ) {
//   return useQuery({
//     queryKey: queryKeys.products.detail(id),
//     queryFn: () => productsApi.getProduct(id),
//     enabled: enabled && String(id).length > 0,
//   });
// }


import { useQuery } from "@tanstack/react-query";

import { productsApi } from "@/features/products/product.api";

import type {
  ProductFilters,
} from "@/features/products/product.types";

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (filters: ProductFilters) =>
    [...productKeys.lists(), filters] as const,

  details: () => [...productKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...productKeys.details(), id] as const,
};

export const useProducts = (
  filters: ProductFilters = {}
) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getProducts(filters),
  });
};