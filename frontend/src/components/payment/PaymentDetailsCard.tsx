
import type { Payment } from "@/types/payment.types";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface PaymentDetailsCardProps {
  payment: Payment;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount);
};

export default function PaymentDetailsCard({
  payment,
}: PaymentDetailsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          Payment Information
        </h2>

        <PaymentStatusBadge status={payment.status} />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Payment ID</span>
          <span className="font-medium">{payment.id}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Order ID</span>
          <span className="font-medium">{payment.orderId}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Amount</span>
          <span className="font-semibold">
            {formatCurrency(payment.amount, payment.currency)}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-medium capitalize">
            {payment.paymentMethod.replaceAll("_", " ")}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Payment Gateway</span>
          <span className="font-medium capitalize">
            {payment.paymentGateway}
          </span>
        </div>

        {payment.transactionId && (
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Transaction ID</span>
            <span className="break-all font-medium">
              {payment.transactionId}
            </span>
          </div>
        )}

        {payment.paidAt && (
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Paid At</span>
            <span className="font-medium">
              {new Date(payment.paidAt).toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Created At</span>
          <span className="font-medium">
            {new Date(payment.createdAt).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
