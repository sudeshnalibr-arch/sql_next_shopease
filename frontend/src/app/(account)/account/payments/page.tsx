
"use client";

import { useMyPayments } from "@/hooks/usePayments";
import PaymentHistoryList from "@/components/payment/PaymentHistoryList";

export default function PaymentHistoryPage() {
  const {
    data,
    isPending,
    isError,
    refetch,
  } = useMyPayments({
    page: 1,
    limit: 10,
  });

  if (isPending) {
    return (
      <div className="p-8 text-center">
        Loading payment history...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">
          Unable to load payment history.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-3 text-orange-600 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">
        My Payments
      </h1>

      <p className="mb-8 text-gray-500">
        View your payment transactions and their statuses.
      </p>

      <PaymentHistoryList
        payments={data?.data ?? []}
      />
    </div>
  );
}
