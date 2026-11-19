// import { useQuery } from "@tanstack/react-query";

// import { getProducts } from "@/features/products/product.api";
// import type { ProductFilters } from "@/features/products/product.types";

// export const productKeys = {
//   all: ["products"] as const,

//   lists: () => [...productKeys.all, "list"] as const,

//   list: (filters: ProductFilters) =>
//     [...productKeys.lists(), filters] as const,

//   details: () => [...productKeys.all, "detail"] as const,

//   detail: (id: number) =>
//     [...productKeys.details(), id] as const,
// };

// export const useProducts = (filters: ProductFilters = {}) => {
//   return useQuery({
//     queryKey: productKeys.list(filters),
//     queryFn: () => getProducts(filters),
//   });
// };

export {
  useProducts,
  productKeys,
} from "@/features/products/product.queries";