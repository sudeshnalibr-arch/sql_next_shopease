interface AppliedCouponProps {
  code: string;
  discountAmount: number;
  onRemove: () => void;
}

export default function AppliedCoupon({
  code,
  discountAmount,
  onRemove,
}: AppliedCouponProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
      <div>
        <p className="font-semibold text-green-800">
          Coupon {code} applied
        </p>

        <p className="text-sm text-green-700">
          You saved ₹{discountAmount.toFixed(2)}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="text-sm font-medium text-red-600 hover:underline"
      >
        Remove
      </button>
    </div>
  );
}