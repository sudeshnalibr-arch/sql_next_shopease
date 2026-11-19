import axiosInstance from "@/lib/axiosInstance";

import type {
  CouponValidationPayload,
  CouponValidationResponse,
} from "./coupon.types";

export const validateCoupon = async (
  payload: CouponValidationPayload
): Promise<CouponValidationResponse["data"]> => {
  const response =
    await axiosInstance.post<CouponValidationResponse>(
      "/coupons/validate",
      payload
    );

  return response.data.data;
};