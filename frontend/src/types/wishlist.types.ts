import type { Product } from "./product.types.";

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  message?: string;
  data: WishlistItem[];
}