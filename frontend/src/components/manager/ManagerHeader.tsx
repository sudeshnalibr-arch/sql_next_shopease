
"use client";

import { Menu, Bell, Search, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";

interface ManagerHeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  staff: "Staff Management",
  products: "Products",
  categories: "Categories",
  orders: "Orders",
  customers: "Customers",
  inventory: "Inventory",
  profile: "My Profile",
};

export default function ManagerHeader({
  onMenuClick,
}: ManagerHeaderProps) {
  const pathname = usePathname();
  const currentPage = pathname.split("/")[2] || "dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between
      border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {pageTitles[currentPage] || "Manager Panel"}
          </h1>
          <p className="hidden text-xs text-gray-500 sm:block">
            Manage your store operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Search"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
        >
          <Search size={20} />
        </button>

        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          <UserCircle size={30} className="text-orange-500" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Manager
            </p>
            <p className="text-xs text-gray-500">Store Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
