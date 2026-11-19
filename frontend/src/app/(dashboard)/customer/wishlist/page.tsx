"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

import CustomerPageHeader from "@/components/customer/CustomerPageHeader";

import {
  useCustomerWishlist,
  useRemoveCustomerWishlistItem,
} from "@/features/customers/wishlist/wishlist.queries";

export default function CustomerWishlistPage() {
  const { data, isLoading, isError } = useCustomerWishlist();
  const removeItem = useRemoveCustomerWishlistItem();

  if (isLoading) {
    return <p className="text-gray-500">Loading wishlist...</p>;
  }

  if (isError) {
    return <p className="text-red-600">Unable to load wishlist.</p>;
  }

  return (
    <div>
      <CustomerPageHeader
        title="My Wishlist"
        description="Products you have saved for later."
      />

      {!data?.length ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <Heart size={40} className="mx-auto text-gray-300" />

          <h2 className="mt-3 font-semibold text-gray-900">
            Your wishlist is empty
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Save products you love and find them here.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="flex h-48 items-center justify-center bg-gray-50">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <Heart size={38} className="text-gray-300" />
                )}
              </div>

              <div className="p-5">
                <h2 className="font-semibold text-gray-900">
                  {item.productName}
                </h2>

                <p className="mt-2 text-lg font-bold text-orange-600">
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {item.stock > 0 ? "In stock" : "Out of stock"}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/products/${item.productId}`}
                    className="text-sm font-semibold text-orange-600"
                  >
                    View Product
                  </Link>

                  <button
                    onClick={() => removeItem.mutate(item.id)}
                    disabled={removeItem.isPending}
                    aria-label={`Remove ${item.productName} from wishlist`}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}