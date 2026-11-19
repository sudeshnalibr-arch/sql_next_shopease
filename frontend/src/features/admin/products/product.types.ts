
export interface Product {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  price: number | string;
  stock: number;
  image: string | null;
  imagePublicId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: ProductPagination;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductDeleteResponse {
  success: boolean;
  message: string;
  data: {
    product: Product;
    permanent: boolean;
  };
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  isActive?: boolean;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  categoryId: number;
  price: number;
  stock: number;
  image?: File | null;
}

export interface UpdateProductInput extends CreateProductInput {
  id: number;
  isActive?: boolean;
}

export interface ProductFormValues {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  stock: string;
  image: File | null;
  isActive: boolean;
}

export interface ProductListData {
  products: Product[];
  pagination: ProductPagination;
}
