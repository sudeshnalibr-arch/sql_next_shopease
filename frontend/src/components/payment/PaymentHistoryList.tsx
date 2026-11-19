
import Link from "next/link";

import type { Payment } from "@/types/payment.types";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface PaymentHistoryListProps {
  payments: Payment[];
}

export default function PaymentHistoryList({
  payments,
}: PaymentHistoryListProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-gray-500">
          You haven't made any payments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5"
        >
          <div className="space-y-2">
            <p className="font-semibold">
              Payment #{payment.id}
            </p>

            <p className="text-sm text-gray-500">
              Order #{payment.orderId}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(payment.createdAt).toLocaleDateString("en-IN")}
            </p>

            <PaymentStatusBadge status={payment.status} />
          </div>

          <div className="text-right">
            <p className="font-semibold">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: payment.currency,
              }).format(payment.amount)}
            </p>

            <Link
              href={`/account/payments/${payment.id}`}
              className="mt-2 inline-block text-sm font-medium text-orange-600 hover:underline"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
