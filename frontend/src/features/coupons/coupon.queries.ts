import { useMutation } from "@tanstack/react-query";

import { validateCoupon } from "./coupon.api";

import type {
  CouponValidationPayload,
} from "./coupon.types";

export const couponKeys = {
  all: ["coupons"] as const,
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (payload: CouponValidationPayload) =>
      validateCoupon(payload),
  });
};