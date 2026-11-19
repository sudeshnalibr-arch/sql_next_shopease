
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useCreatePayment } from "@/hooks/usePayments";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";

import type { PaymentMethod } from "@/types/payment.types";

function CheckoutPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = Number(searchParams.get("orderId"));

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const createPaymentMutation = useCreatePayment();

  const handlePayment = () => {
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return;
    }

    createPaymentMutation.mutate(
      {
        orderId,
        paymentGateway: "cod",
        paymentMethod: "cod",
      },
      {
        onSuccess: (payment) => {
          router.push(`/account/payments/${payment.id}`);
        },
      }
    );
  };

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return (
      <p className="text-red-600">
        Invalid order. Please return to checkout.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">
        Payment
      </h1>

      <p className="mb-8 text-gray-500">
        Choose how you want to pay for order #{orderId}.
      </p>

      <PaymentMethodSelector
        value={paymentMethod}
        onChange={setPaymentMethod}
      />

      {createPaymentMutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          {createPaymentMutation.error instanceof Error
            ? createPaymentMutation.error.message
            : "Unable to create payment. Please try again."}
        </p>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={createPaymentMutation.isPending}
        className="mt-8 w-full rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createPaymentMutation.isPending
          ? "Processing..."
          : "Confirm Cash on Delivery"}
      </button>
    </div>
  );
}

export default function CheckoutPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center">
          Loading payment page...
        </div>
      }
    >
      <CheckoutPaymentContent />
    </Suspense>
  );
}
