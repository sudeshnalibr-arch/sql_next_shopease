import axiosInstance from "@/lib/axiosInstance";

import type {
  Review,
  ReviewListResponse,
  ReviewResponse,
  CreateReviewPayload,
} from "./review.types";

export type UpdateReviewPayload = Partial<
  Pick<CreateReviewPayload, "rating" | "comment">
>;

export const reviewApi = {
  async getProductReviews(productId: number): Promise<Review[]> {
    const response = await axiosInstance.get<ReviewListResponse>(
      `/reviews/product/${productId}`
    );

    return response.data.data;
  },

  async getMyReviews(): Promise<Review[]> {
    const response = await axiosInstance.get<ReviewListResponse>(
      "/reviews/my"
    );

    return response.data.data;
  },

  async getReviewById(id: number): Promise<Review> {
    const response = await axiosInstance.get<ReviewResponse>(
      `/reviews/${id}`
    );

    return response.data.data;
  },

  async createReview(payload: CreateReviewPayload): Promise<Review> {
    const response = await axiosInstance.post<ReviewResponse>(
      "/reviews",
      payload
    );

    return response.data.data;
  },

  async updateReview(
    id: number,
    payload: UpdateReviewPayload
  ): Promise<Review> {
    const response = await axiosInstance.patch<ReviewResponse>(
      `/reviews/${id}`,
      payload
    );

    return response.data.data;
  },

  async deleteReview(id: number): Promise<void> {
    await axiosInstance.delete(`/reviews/${id}`);
  },
};