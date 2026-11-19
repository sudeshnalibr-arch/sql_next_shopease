import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { reviewApi } from "./review.api";

import type {
  CreateReviewPayload,
} from "./review.types";

import type {
  UpdateReviewPayload,
} from "./review.api";

export const reviewKeys = {
  all: ["reviews"] as const,

  lists: () => [...reviewKeys.all, "list"] as const,

  productReviews: (productId: number) =>
    [...reviewKeys.lists(), "product", productId] as const,

  myReviews: () =>
    [...reviewKeys.lists(), "my"] as const,

  details: () => [...reviewKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...reviewKeys.details(), id] as const,
};

// Get reviews for a particular product
export const useProductReviews = (productId: number) => {
  return useQuery({
    queryKey: reviewKeys.productReviews(productId),
    queryFn: () => reviewApi.getProductReviews(productId),
    enabled: Number.isFinite(productId) && productId > 0,
  });
};

// Get reviews written by the logged-in user
export const useMyReviews = () => {
  return useQuery({
    queryKey: reviewKeys.myReviews(),
    queryFn: reviewApi.getMyReviews,
  });
};

// Get a single review
export const useReview = (id: number) => {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => reviewApi.getReviewById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

// Create a review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewApi.createReview(payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.productReviews(variables.productId),
      });

      queryClient.invalidateQueries({
        queryKey: reviewKeys.myReviews(),
      });
    },
  });
};

// Update a review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateReviewPayload;
    }) => reviewApi.updateReview(id, payload),

    onSuccess: (updatedReview) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });

      queryClient.setQueryData(
        reviewKeys.detail(updatedReview.id),
        updatedReview
      );
    },
  });
};

// Delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reviewApi.deleteReview(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.all,
      });
    },
  });
};