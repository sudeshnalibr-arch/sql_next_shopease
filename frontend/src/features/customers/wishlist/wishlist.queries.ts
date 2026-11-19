import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCustomerWishlist,
  removeCustomerWishlistItem,
} from "./wishlist.api";

export const customerWishlistKeys = {
  all: ["customer-wishlist"] as const,
  list: () => [...customerWishlistKeys.all, "list"] as const,
};

export const useCustomerWishlist = () => {
  return useQuery({
    queryKey: customerWishlistKeys.list(),
    queryFn: getCustomerWishlist,
    staleTime: 60 * 1000,
  });
};

export const useRemoveCustomerWishlistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCustomerWishlistItem,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: customerWishlistKeys.all,
      }),
  });
};