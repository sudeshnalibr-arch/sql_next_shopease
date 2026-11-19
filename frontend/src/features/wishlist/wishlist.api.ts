import axiosInstance from "@/lib/axiosInstance";
import type {
  WishlistItem,
  WishlistResponse,
} from "./wishlist.types";

export const wishlistApi = {
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await axiosInstance.get<WishlistResponse>("/wishlist");
    return response.data.data;
  },

  async addToWishlist(productId: number): Promise<WishlistItem> {
    const response = await axiosInstance.post<{
      success: boolean;
      data: WishlistItem;
    }>(`/wishlist/${productId}`);

    return response.data.data;
  },

  async removeFromWishlist(productId: number): Promise<void> {
    await axiosInstance.delete(`/wishlist/${productId}`);
  },
};