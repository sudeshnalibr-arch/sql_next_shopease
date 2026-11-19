import api from "@/lib/axiosInstance";

import type {
  CustomerWishlistItem,
  CustomerWishlistResponse,
} from "./wishlist.types";

export const getCustomerWishlist =
  async (): Promise<CustomerWishlistItem[]> => {
    const response = await api.get<CustomerWishlistResponse>(
      "/wishlist"
    );

    return response.data.data;
  };

export const removeCustomerWishlistItem = async (
  id: number
): Promise<void> => {
  await api.delete(`/wishlist/${id}`);
};