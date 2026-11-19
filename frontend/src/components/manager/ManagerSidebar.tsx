
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  ShoppingCart,
  UserRound,
  Warehouse,
  UserCircle,
  Store,
  X,
} from "lucide-react";

interface ManagerSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/manager/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Staff Management",
    href: "/manager/staff",
    icon: Users,
  },
  {
    label: "Products",
    href: "/manager/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/manager/categories",
    icon: Tags,
  },
  {
    label: "Orders",
    href: "/manager/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    href: "/manager/customers",
    icon: UserRound,
  },
  {
    label: "Inventory",
    href: "/manager/inventory",
    icon: Warehouse,
  },
  {
    label: "My Profile",
    href: "/manager/profile",
    icon: UserCircle,
  },
];

export default function ManagerSidebar({
  open,
  onClose,
}: ManagerSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -300 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col
          border-r border-white/10 bg-[#171A2B] text-white
          lg:translate-x-0"
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/manager/dashboard" className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-500 p-2">
              <Store size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold">ShopEase</h2>
              <p className="text-xs text-gray-400">Manager Panel</p>
            </div>
          </Link>

          <button onClick={onClose} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Management
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/manager/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-orange-500 font-semibold text-white shadow-lg shadow-orange-500/20"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <p className="text-xs text-gray-500">
            ShopEase Management
          </p>
          <p className="mt-1 text-sm font-medium text-gray-300">
            Manager Workspace
          </p>
        </div>
      </motion.aside>
    </>
  );
}
