import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ProductListResponse,
} from "@/types/product.types.";

export const productsApi = {
  async getProducts(
    filters: ProductFilters = {},
  ): Promise<ProductListResponse> {
    const response = await axiosInstance.get<
      ApiResponse<ProductListResponse>
    >("/products", {
      params: filters,
    });

    return response.data.data;
  },

  async getProduct(
    id: number | string,
  ): Promise<Product> {
    const response = await axiosInstance.get<
      ApiResponse<Product>
    >(`/products/${id}`);

    return response.data.data;
  },

  async createProduct(
    input: CreateProductInput,
  ): Promise<Product> {
    const response = await axiosInstance.post<
      ApiResponse<Product>
    >("/products", input);

    return response.data.data;
  },

  async updateProduct(
    id: number | string,
    input: UpdateProductInput,
  ): Promise<Product> {
    const response = await axiosInstance.patch<
      ApiResponse<Product>
    >(`/products/${id}`, input);

    return response.data.data;
  },

  async deleteProduct(
    id: number | string,
  ): Promise<void> {
    await axiosInstance.delete(`/products/${id}`);
  },
};