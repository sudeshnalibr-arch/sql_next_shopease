
import type { PaymentMethod } from "@/types/payment.types";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">
        Select Payment Method
      </h2>

      <button
        type="button"
        onClick={() => onChange("cod")}
        className={`w-full rounded-lg border p-4 text-left transition ${
          value === "cod"
            ? "border-orange-500 bg-orange-50"
            : "border-gray-200 hover:border-orange-300"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="radio"
            checked={value === "cod"}
            onChange={() => onChange("cod")}
          />

          <div>
            <p className="font-medium text-gray-900">
              Cash on Delivery
            </p>

            <p className="text-sm text-gray-500">
              Pay when your order is delivered.
            </p>
          </div>
        </div>
      </button>

      <div className="rounded-lg border border-dashed border-gray-300 p-4">
        <p className="font-medium text-gray-500">
          Online Payment
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Card, UPI and net banking will be available
          after payment gateway integration.
        </p>
      </div>
    </div>
  );
}
