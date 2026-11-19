
"use client";

import type { CartItem as CartItemType } from "@/lib/types";
import { useCart } from "@/providers/CartProvider";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <article className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
      <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          ₹{Number(product.price).toLocaleString("en-IN")} each
        </p>
        <p className="mt-2 font-semibold">
          Subtotal: ₹{(Number(product.price) * quantity).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease quantity of ${product.name}`}
          disabled={quantity <= 1}
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className="size-9 rounded-md border disabled:opacity-40"
        >
          −
        </button>

        <span className="min-w-6 text-center">{quantity}</span>

        <button
          type="button"
          aria-label={`Increase quantity of ${product.name}`}
          disabled={quantity >= product.stock}
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="size-9 rounded-md border disabled:opacity-40"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => removeFromCart(product.id)}
          className="ml-2 text-sm text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
    </article>
  );
}
