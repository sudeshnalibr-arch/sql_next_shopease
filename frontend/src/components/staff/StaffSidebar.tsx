"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  UserCircle,
  Store,
  X,
} from "lucide-react";

interface StaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/staff/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/staff/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/staff/orders",
    icon: ShoppingCart,
  },
  {
    label: "Inventory",
    href: "/staff/inventory",
    icon: Warehouse,
  },
  {
    label: "Customers",
    href: "/staff/customers",
    icon: Users,
  },
  {
    label: "My Profile",
    href: "/staff/profile",
    icon: UserCircle,
  },
];

export default function StaffSidebar({
  isOpen,
  onClose,
}: StaffSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#171A2B] text-white lg:translate-x-0"
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/staff/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
              <Store size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">ShopEase</h1>
              <p className="text-xs text-gray-400">Staff Panel</p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Workspace
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <p className="text-xs text-gray-400">
            ShopEase Staff Workspace
          </p>
        </div>
      </motion.aside>
    </>
  );
}