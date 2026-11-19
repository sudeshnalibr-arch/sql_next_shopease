export interface ReviewUser {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  orderId: number;
  rating: number;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  user?: ReviewUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  productId: number;
  orderId: number;
  rating: number;
  comment: string;
}

export interface ReviewListResponse {
  success: boolean;
  message?: string;
  data: Review[];
}

export interface ReviewResponse {
  success: boolean;
  message?: string;
  data: Review;
}