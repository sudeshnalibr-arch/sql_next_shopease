"use client";

import { useState } from "react";

interface CouponInputProps {
  onApply: (code: string) => void;
  isPending: boolean;
}

export default function CouponInput({
  onApply,
  isPending,
}: CouponInputProps) {
  const [code, setCode] = useState("");

  const handleApply = () => {
    if (!code.trim()) return;

    onApply(code.trim().toUpperCase());
  };

  return (
    <div className="rounded-xl border p-5">
      <h3 className="mb-3 font-semibold">Apply Coupon</h3>

      <div className="flex gap-2">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter coupon code"
          className="min-w-0 flex-1 rounded-lg border px-3 py-2 outline-none focus:border-orange-500"
        />

        <button
          type="button"
          onClick={handleApply}
          disabled={isPending || !code.trim()}
          className="rounded-lg bg-orange-600 px-5 py-2 text-white disabled:opacity-50"
        >
          {isPending ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
}