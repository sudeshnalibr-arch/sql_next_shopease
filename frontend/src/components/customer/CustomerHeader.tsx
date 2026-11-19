"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, Bell } from "lucide-react";

interface CustomerHeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/customer/dashboard": "Dashboard",
  "/customer/orders": "My Orders",
  "/customer/addresses": "My Addresses",
  "/customer/wishlist": "My Wishlist",
  "/customer/reviews": "My Reviews",
  "/customer/notifications": "Notifications",
  "/customer/profile": "My Profile",
};

export default function CustomerHeader({
  onMenuClick,
}: CustomerHeaderProps) {
  const pathname = usePathname();

  const title = pageTitles[pathname] ?? "My Account";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
            {title}
          </h1>

          <p className="hidden text-xs text-gray-500 sm:block">
            Manage your ShopEase account
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/customer/notifications"
          aria-label="Notifications"
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <Bell size={20} />
        </Link>

        <Link
          href="/cart"
          aria-label="Shopping cart"
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <ShoppingBag size={20} />
        </Link>
      </div>
    </header>
  );
}