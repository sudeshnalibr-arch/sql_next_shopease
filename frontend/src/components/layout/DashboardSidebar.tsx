"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  BarChart3,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import DashboardLogout from "@/components/layout/DashboardLogout";

const menus = {
  admin: [
    { label: "Dashboard", href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: "Users", href: ROUTES.ADMIN.USERS, icon: Users },
    { label: "Products", href: ROUTES.ADMIN.PRODUCTS, icon: Package },
    { label: "Orders", href: ROUTES.ADMIN.ORDERS, icon: ShoppingBag },
    { label: "Analytics", href: ROUTES.ADMIN.ANALYTICS, icon: BarChart3 },
  ],
  manager: [
    {
      label: "Dashboard",
      href: ROUTES.MANAGER.DASHBOARD,
      icon: LayoutDashboard,
    },
    { label: "Users", href: ROUTES.MANAGER.USERS, icon: Users },
    { label: "Products", href: ROUTES.MANAGER.PRODUCTS, icon: Package },
    { label: "Orders", href: ROUTES.MANAGER.ORDERS, icon: ShoppingBag },
  ],
  staff: [
    { label: "Dashboard", href: ROUTES.STAFF.DASHBOARD, icon: LayoutDashboard },
    { label: "Products", href: ROUTES.STAFF.PRODUCTS, icon: Package },
    { label: "Orders", href: ROUTES.STAFF.ORDERS, icon: ShoppingBag },
  ],
  customer: [
    { label: "Products", href: ROUTES.PRODUCTS.LIST, icon: Package },
    { label: "My Orders", href: ROUTES.ORDERS.LIST, icon: ShoppingBag },
  ],
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const items = role ? menus[role] : [];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-background p-4">
      <Link href={ROUTES.HOME} className="mb-8 text-2xl font-bold">
        Shop<span className="text-orange-500">Ease</span>
      </Link>

      <div className="mb-5">
        <p className="font-semibold">{user?.name ?? "Account"}</p>
        <p className="text-xs capitalize text-muted-foreground">
          {role ?? "Guest"}
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                active
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* <button
        onClick={() => void logout()}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <LogOut className="size-4" />
        Logout
      </button> */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <DashboardLogout />
      </div>
    </aside>
  );
}
