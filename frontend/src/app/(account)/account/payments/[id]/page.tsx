
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { usePayment } from "@/hooks/usePayments";
import PaymentDetailsCard from "@/components/payment/PaymentDetailsCard";

export default function PaymentDetailsPage() {
  const params = useParams<{ id: string }>();

  const paymentId = Number(params.id);

  const {
    data: payment,
    isPending,
    isError,
  } = usePayment(paymentId);

  if (!Number.isInteger(paymentId) || paymentId <= 0) {
    return <p className="p-8">Invalid payment ID.</p>;
  }

  if (isPending) {
    return (
      <div className="p-8 text-center">
        Loading payment details...
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">
          Unable to find payment details.
        </p>

        <Link
          href="/account/payments"
          className="mt-4 inline-block text-orange-600 hover:underline"
        >
          Back to payments
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/account/payments"
        className="mb-6 inline-block text-sm text-orange-600 hover:underline"
      >
        ← Back to payments
      </Link>

      <h1 className="mb-6 text-2xl font-bold">
        Payment Details
      </h1>

      <PaymentDetailsCard payment={payment} />
    </div>
  );
}
