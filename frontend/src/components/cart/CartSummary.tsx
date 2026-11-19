
"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export default function CartSummary() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, itemCount, subtotal, isCartLoaded } = useCart();

  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  function proceedToCheckout() {
    if (!user) {
      router.push(`${ROUTES.AUTH.LOGIN}?next=${encodeURIComponent(ROUTES.CART)}`);
      return;
    }

    router.push("/checkout");
  }

  return (
    <aside className="h-fit rounded-xl border p-5">
      <h2 className="text-lg font-semibold">Order summary</h2>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between gap-4 text-base font-bold">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!isCartLoaded || items.length === 0}
        onClick={proceedToCheckout}
        className="mt-5 w-full rounded-md bg-orange-500 px-4 py-3 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proceed to checkout
      </button>

      <p className="mt-3 text-xs text-muted-foreground">
        Final prices and stock availability are verified by the server at checkout.
      </p>
    </aside>
  );
}
