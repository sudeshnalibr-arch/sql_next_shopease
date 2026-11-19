export interface Product {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  price: number;
  stock: number;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  categoryId: number;
  price: number;
  stock: number;
  image?: string | null;
}

export interface UpdateProductInput {
  name?: string;
  description?: string | null;
  categoryId?: number;
  price?: number;
  stock?: number;
  image?: string | null;
  isActive?: boolean;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "ASC" | "DESC";
}

export interface ProductListResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}