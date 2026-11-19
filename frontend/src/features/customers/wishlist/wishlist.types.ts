export interface CustomerWishlistItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  image?: string | null;
  stock: number;
}

export interface CustomerWishlistResponse {
  success: boolean;
  message: string;
  data: CustomerWishlistItem[];
}