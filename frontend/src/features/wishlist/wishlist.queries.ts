import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { wishlistApi } from "./wishlist.api";

export const wishlistKeys = {
  all: ["wishlist"] as const,
  lists: () => [...wishlistKeys.all, "list"] as const,
  list: () => [...wishlistKeys.lists()] as const,
};

export const useWishlist = () => {
  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: wishlistApi.getWishlist,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) =>
      wishlistApi.addToWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all,
      });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) =>
      wishlistApi.removeFromWishlist(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all,
      });
    },
  });
};