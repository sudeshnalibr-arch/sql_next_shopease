"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Package,
  Tags,
  ShoppingCart,
  UserRound,
  TicketPercent,
  ChartNoAxesCombined,
  Settings,
  Menu,
  X,
  Store,
} from "lucide-react";
import DashboardLogout from "../layout/DashboardLogout";

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Managers", href: "/admin/managers", icon: UserCog },
      { label: "Staff", href: "/admin/staff", icon: Users },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Tags },
    ],
  },
  {
    title: "SALES",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Customers", href: "/admin/customers", icon: UserRound },
      { label: "Coupons", href: "/admin/coupons", icon: TicketPercent },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      {
        label: "Reports",
        href: "/admin/reports",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#171A2B] text-white">
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
          <Store size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold tracking-wide">ShopEase</h2>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
        {navigation.map((group) => (
          <div key={group.title}>
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[2px] text-gray-500">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                      active
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>

                    {active && (
                      <motion.span
                        layoutId="admin-active-indicator"
                        className="absolute inset-0 -z-0 rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-5">
      
        <div className="rounded-xl bg-white/5 p-3">
        <div className="border-b pb-2">
                <DashboardLogout />
        </div>
            
          <p className="text-sm font-semibold pt-3">ShopEase Admin</p>
          <p className="mt-1 text-xs text-gray-400">Manage your store</p>
          
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-5 z-40 rounded-lg bg-[#171A2B] p-2 text-white lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] lg:block">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              aria-label="Close navigation"
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 z-10 rounded-lg p-2 text-white"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>

              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
