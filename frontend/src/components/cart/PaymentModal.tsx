
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck, X } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  amount: number;
  itemCount: number;
  isProcessing?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function PaymentModal({
  isOpen,
  amount,
  itemCount,
  isProcessing = false,
  onConfirm,
  onClose,
}: PaymentModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isProcessing) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isProcessing, onClose]);

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isProcessing) {
              onClose();
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-orange-500/20 bg-[#120A05] text-[#FFF7ED] shadow-2xl shadow-black/40"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 px-6 py-5">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                aria-label="Close payment confirmation"
                className="absolute right-4 top-4 rounded-lg p-2 text-stone-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <CreditCard size={25} />
              </div>

              <h2
                id="payment-modal-title"
                className="text-xl font-bold"
              >
                Confirm Your Order
              </h2>

              <p className="mt-1 pr-6 text-sm text-stone-400">
                Review your order details before continuing.
              </p>
            </div>

            {/* Order summary */}
            <div className="space-y-4 px-6 py-6">
              <div className="rounded-xl border border-white/10 bg-[#1C1008] p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-400">
                    Items in your order
                  </span>
                  <span className="font-medium">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="my-4 border-t border-white/10" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-stone-400">
                    Total amount
                  </span>
                  <span className="text-2xl font-bold text-orange-400">
                    {formattedAmount}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />
                <div>
                  <p className="text-sm font-medium text-emerald-300">
                    Secure checkout
                  </p>
                  <p className="mt-1 text-xs leading-5 text-stone-400">
                    Your order will be submitted to the server for processing.
                    Payment is not collected by this demo modal.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                type="button"
                onClick={() => void onConfirm()}
                disabled={isProcessing || itemCount <= 0 || amount <= 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Confirm Order · {formattedAmount}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-stone-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <p className="text-center text-xs text-stone-500">
                Your final order total should be validated by the backend.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
