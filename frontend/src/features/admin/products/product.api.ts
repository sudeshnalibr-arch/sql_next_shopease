
import axiosInstance from "@/lib/axiosInstance";

import type {
  Product,
  ProductListParams,
  ProductListData,
  ProductResponse,
  ProductListResponse,
  ProductDeleteResponse,
  CreateProductInput,
  UpdateProductInput,
} from "./product.types";

const PRODUCT_ENDPOINT = "/products/manage";

const createProductFormData = (
  input: CreateProductInput | UpdateProductInput
): FormData => {
  const formData = new FormData();

  formData.append("name", input.name);
  formData.append("description", input.description ?? "");
  formData.append("categoryId", String(input.categoryId));
  formData.append("price", String(input.price));
  formData.append("stock", String(input.stock));

  if (input.image) {
    formData.append("image", input.image);
  }

  if ("isActive" in input && input.isActive !== undefined) {
    formData.append("isActive", String(input.isActive));
  }

  return formData;
};

export const productApi = {
  // GET PRODUCTS WITH PAGINATION
  getProducts: async (
    params: ProductListParams = {}
  ): Promise<ProductListData> => {
    const response = await axiosInstance.get<ProductListResponse>(
      PRODUCT_ENDPOINT,
      { params }
    );

    return {
      products: response.data.data,
      pagination: response.data.pagination,
    };
  },

  // GET SINGLE PRODUCT
  getProductById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get<ProductResponse>(
      PRODUCT_ENDPOINT,
      {
        params: { id },
      }
    );

    return response.data.data;
  },

  // CREATE PRODUCT
  createProduct: async (
    input: CreateProductInput
  ): Promise<Product> => {
    const formData = createProductFormData(input);

    const response = await axiosInstance.post<ProductResponse>(
      PRODUCT_ENDPOINT,
      formData
    );

    return response.data.data;
  },

  // UPDATE PRODUCT
  updateProduct: async (
    input: UpdateProductInput
  ): Promise<Product> => {
    const formData = createProductFormData(input);

    const response = await axiosInstance.patch<ProductResponse>(
      `${PRODUCT_ENDPOINT}?id=${input.id}`,
      formData
    );

    return response.data.data;
  },

  // SOFT DELETE PRODUCT
  deleteProduct: async (id: number): Promise<ProductDeleteResponse> => {
    const response = await axiosInstance.delete<ProductDeleteResponse>(
      `${PRODUCT_ENDPOINT}?id=${id}`
    );

    return response.data;
  },
};
