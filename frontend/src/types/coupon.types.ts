export type CouponDiscountType = "percentage" | "fixed";

export interface CouponValidationPayload {
  code: string;
  orderAmount: number;
}

export interface CouponValidationResult {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
}

export interface CouponValidationResponse {
  success: boolean;
  message?: string;
  data: CouponValidationResult;
}