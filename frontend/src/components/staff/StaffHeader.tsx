"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Search } from "lucide-react";

interface StaffHeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/staff/dashboard": "Dashboard",
  "/staff/products": "Products",
  "/staff/orders": "Orders",
  "/staff/inventory": "Inventory",
  "/staff/customers": "Customers",
  "/staff/profile": "My Profile",
};

export default function StaffHeader({
  onMenuClick,
}: StaffHeaderProps) {
  const pathname = usePathname();

  const title = pageTitles[pathname] ?? "Staff Workspace";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
            {title}
          </h1>
          <p className="hidden text-xs text-gray-500 sm:block">
            Manage your daily store operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Search"
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <Search size={20} />
        </button>

        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <Bell size={20} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
          S
        </div>
      </div>
    </header>
  );
}