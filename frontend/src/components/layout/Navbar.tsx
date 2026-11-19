"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Menu,
  ShoppingCart,
  X,
  LogOut,
  UserRound,
  Heart,
  Layers,
  Package,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/providers/CartProvider";
import { ROUTES } from "@/constants/routes";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isLoading, logout } = useAuth();
  const { itemCount } = useCart();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  const linkClass =
    "text-sm font-medium transition-colors hover:text-orange-500";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="text-2xl font-bold tracking-tight"
          onClick={closeMenu}
        >
          Shop<span className="text-orange-500">Ease</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href={ROUTES.HOME} className={linkClass}>
            Home
          </Link>

          <Link href={ROUTES.PRODUCTS.LIST} className={linkClass}>
            Products
          </Link>

          <Link href={ROUTES.CATEGORIES.LIST} className={linkClass}>
            Categories
          </Link>

          {user && (
            <>
              <Link href={ROUTES.WISHLIST} className={linkClass}>
                Wishlist
              </Link>

              <Link href={ROUTES.ORDERS.LIST} className={linkClass}>
                My Orders
              </Link>
            </>
          )}
        </div>

        {/* Desktop Account Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Cart */}
          {/* <Link
            href={ROUTES.CART}
            aria-label={`Shopping cart, ${itemCount} items`}
            className="relative rounded-md p-2 transition hover:bg-muted"
          >
            <ShoppingCart className="size-5" />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link> */}

          <Link
            href={ROUTES.CART}
            aria-label={`Shopping cart, ${itemCount} items`}
            className="relative rounded-md p-2 transition-colors duration-200 hover:text-orange-600 hover:bg-amber-50"
          >
            <ShoppingCart className="size-5" />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Authentication */}
          {isLoading ? (
            <span className="text-sm text-muted-foreground">Loading...</span>
          ) : user ? (
            <>
              {/* Notifications */}
              <NotificationBell />

              {/* Profile */}
              <Link
                href={ROUTES.PROFILE}
                className="flex items-center gap-2 text-sm"
              >
                <UserRound className="size-4" />
                <span className="max-w-28 truncate">{user.name}</span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-muted"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href={ROUTES.AUTH.LOGIN} className={linkClass}>
                Login
              </Link>

              <Link
                href={ROUTES.AUTH.REGISTER}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Cart */}
          <Link
            href={ROUTES.CART}
            aria-label={`Shopping cart, ${itemCount} items`}
            onClick={closeMenu}
            className="relative rounded-md p-2 transition hover:bg-muted"
          >
            <ShoppingCart className="size-5" />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Notifications */}
          {!isLoading && user && <NotificationBell />}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-md p-2 transition hover:bg-muted"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="space-y-1 border-t p-4 md:hidden"
        >
          <Link
            className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
            href={ROUTES.HOME}
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
            href={ROUTES.PRODUCTS.LIST}
            onClick={closeMenu}
          >
            <Package className="size-4" />
            Products
          </Link>

          <Link
            className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
            href={ROUTES.CATEGORIES.LIST}
            onClick={closeMenu}
          >
            <Layers className="size-4" />
            Categories
          </Link>

          {user && (
            <>
              <Link
                className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                href={ROUTES.WISHLIST}
                onClick={closeMenu}
              >
                <Heart className="size-4" />
                Wishlist
              </Link>

              <Link
                className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                href={ROUTES.ORDERS.LIST}
                onClick={closeMenu}
              >
                <Package className="size-4" />
                My Orders
              </Link>

              <Link
                className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                href={ROUTES.PROFILE}
                onClick={closeMenu}
              >
                <UserRound className="size-4" />
                My Profile
              </Link>

              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-muted"
                onClick={() => void handleLogout()}
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </>
          )}

          {isLoading && (
            <p className="p-2 text-sm text-muted-foreground">
              Loading account...
            </p>
          )}

          {!user && !isLoading && (
            <>
              <Link
                className="block rounded-md p-2 hover:bg-muted"
                href={ROUTES.AUTH.LOGIN}
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                className="block rounded-md p-2 hover:bg-muted"
                href={ROUTES.AUTH.REGISTER}
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
