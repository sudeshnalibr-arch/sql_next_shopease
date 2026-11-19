"use client";

import { useWishlist } from "@/hooks/useWishList";
import WishlistList from "@/components/wishlist/WishlistList";

export default function WishlistPage() {
  const {
    data,
    isPending,
    isError,
    refetch,
  } = useWishlist();

  if (isPending) {
    return <p className="p-8 text-center">Loading wishlist...</p>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p>Unable to load your wishlist.</p>
        <button onClick={() => refetch()} className="mt-3 text-orange-600 underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">My Wishlist</h1>
      <p className="mb-8 text-gray-500">
        Products you have saved for later.
      </p>

      <WishlistList items={data?.data ?? []} />
    </main>
  );
}