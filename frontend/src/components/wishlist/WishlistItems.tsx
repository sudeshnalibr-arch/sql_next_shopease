"use client";

import Image from "next/image";
import Link from "next/link";

import { useRemoveFromWishlist } from "@/hooks/useWishList";
import type { WishlistItem as WishlistItemType } from "@/types/wishlist.types";

interface Props {
  item: WishlistItemType;
}

export default function WishlistItem({ item }: Props) {
  const removeMutation = useRemoveFromWishlist();

  const product = item.product;

  if (!product) return null;

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold hover:text-orange-600">
            {product.name}
          </h3>
        </Link>

        <p className="font-semibold">
          ₹{product.price}
        </p>

        <button
          type="button"
          onClick={() => removeMutation.mutate(product.id)}
          disabled={removeMutation.isPending}
          className="w-full rounded-lg border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Remove from wishlist
        </button>
      </div>
    </div>
  );
}