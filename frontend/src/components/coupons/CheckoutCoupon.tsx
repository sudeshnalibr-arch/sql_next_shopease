"use client";

import { useState } from "react";

import CouponInput from "@/components/coupons/CouponInput";
import AppliedCoupon from "@/components/coupons/AppliedCoupon";
import { useValidateCoupon } from "@/hooks/useCoupons";

import type {
  CouponValidationResult,
} from "@/features/coupons/coupon.types";

interface CheckoutCouponProps {
  subtotal: number;
}

export default function CheckoutCoupon({
  subtotal,
}: CheckoutCouponProps) {
  const [appliedCoupon, setAppliedCoupon] =
    useState<CouponValidationResult | null>(null);

  const validateMutation = useValidateCoupon();

  const handleApply = (code: string) => {
    validateMutation.mutate(
      {
        code,
        orderAmount: subtotal,
      },
      {
        onSuccess: (result) => {
          setAppliedCoupon(result);
        },
      }
    );
  };

  const discount = appliedCoupon?.discountAmount ?? 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="space-y-4">
      {appliedCoupon ? (
        <AppliedCoupon
          code={appliedCoupon.code}
          discountAmount={discount}
          onRemove={() => setAppliedCoupon(null)}
        />
      ) : (
        <CouponInput
          onApply={handleApply}
          isPending={validateMutation.isPending}
        />
      )}

      {validateMutation.isError && (
        <p className="text-sm text-red-600">
          {validateMutation.error instanceof Error
            ? validateMutation.error.message
            : "Invalid coupon code."}
        </p>
      )}

      <div className="space-y-2 rounded-xl border p-5">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>- ₹{discount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between border-t pt-3 font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}