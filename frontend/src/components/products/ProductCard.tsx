
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Package } from "lucide-react";
import type { Product } from "@/types/product.types.";
import { useCart } from "@/providers/CartProvider";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/products/${product.id}`}
        className="relative block h-56 bg-gray-100"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Package size={48} />
          </div>
        )}
      </Link>

      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h2 className="line-clamp-1 text-lg font-semibold text-gray-900 transition hover:text-orange-600">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
          {product.description || "Discover this product in our store."}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xl font-bold text-orange-600">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          <span
            className={`text-xs font-medium ${
              isOutOfStock ? "text-red-600" : "text-green-600"
            }`}
          >
            {isOutOfStock ? "Out of stock" : `${product.stock} available`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {added ? (
            <>
              <Check size={18} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              {isOutOfStock ? "Unavailable" : "Add to Cart"}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
