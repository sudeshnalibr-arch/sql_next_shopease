
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { productApi } from "./product.api";
import type {
  ProductListParams,
  CreateProductInput,
  UpdateProductInput,
} from "./product.types";

// QUERY KEYS
export const productQueryKeys = {
  all: ["products"] as const,

  lists: () => [...productQueryKeys.all, "list"] as const,

  list: (params: ProductListParams) =>
    [...productQueryKeys.lists(), params] as const,

  details: () => [...productQueryKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...productQueryKeys.details(), id] as const,
};

// GET PRODUCTS
export const useProducts = (params: ProductListParams = {}) => {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => productApi.getProducts(params),
  });
};

// GET SINGLE PRODUCT
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: id > 0,
  });
};

// CREATE PRODUCT
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) =>
      productApi.createProduct(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      });
    },
  });
};

// UPDATE PRODUCT
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProductInput) =>
      productApi.updateProduct(input),

    onSuccess: (product) => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      });

      queryClient.setQueryData(
        productQueryKeys.detail(product.id),
        product
      );
    },
  });
};

// SOFT DELETE PRODUCT
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      productApi.deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      });
    },
  });
};
