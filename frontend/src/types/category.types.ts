// export interface Category {
//   id: number;
//   name: string;
//   description: string | null;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CategoryPayload {
//   name: string;
//   description?: string | null;
// }



// export interface CategoryPagination {
//   totalItems: number;
//   currentPage: number;
//   totalPages: number;
//   pageSize: number;
// }

// export interface CategoryListResponse {
//   success: boolean;
//   message: string;
//   data: Category[];
//   pagination: CategoryPagination;
// }


export interface UpdateCategoryPayload {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  description?: string | null;
}

export interface CategoryUpdatePayload {
  name?: string;
  description?: string | null;
}

export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | "all";
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}