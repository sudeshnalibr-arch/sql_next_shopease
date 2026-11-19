"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { useCart } from "@/providers/CartProvider";
import PaymentModal from "@/components/cart/PaymentModal";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, clearCart, isCartLoaded } = useCart();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleConfirmOrder() {
    if (items.length === 0 || isProcessing) return;

    setIsProcessing(true);

    try {
      await axiosInstance.post("/orders", {
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
      });

      clearCart();
      setIsModalOpen(false);
      toast.success("Your order has been placed.");
      router.push("/orders");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? "Unable to place your order. Check stock and try again."
          : "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }

  if (!isCartLoaded) return <main className="p-10">Loading checkout...</main>;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-muted-foreground">Add products to your cart first.</p>
        <Button className="mt-5" onClick={() => router.push("/products")}>
          Browse products
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <section className="mt-6 rounded-xl border p-6">
        <h2 className="font-semibold">Order summary</h2>

        <div className="mt-4 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between gap-4 text-sm">
              <span>{product.name} × {quantity}</span>
              <span>
                {(Number(product.price) * quantity).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-between border-t pt-4 font-bold">
          <span>Total</span>
          <span>{subtotal.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</span>
        </div>

        <Button
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsModalOpen(true)}
        >
          Continue to confirmation
        </Button>
      </section>

      <PaymentModal
        isOpen={isModalOpen}
        amount={subtotal}
        itemCount={itemCount}
        isProcessing={isProcessing}
        onConfirm={handleConfirmOrder}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}