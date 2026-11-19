import type { WishlistItem as WishlistItemType } from "@/types/wishlist.types";
import WishlistItem from "./WishlistItems";

interface Props {
  items: WishlistItemType[];
}

export default function WishlistList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border p-10 text-center">
        <h2 className="text-lg font-semibold">Your wishlist is empty</h2>
        <p className="mt-2 text-gray-500">
          Save products you like and find them here later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <WishlistItem key={item.id} item={item} />
      ))}
    </div>
  );
}