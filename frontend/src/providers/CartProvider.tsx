
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product, CartItem } from "@/lib/types";

// export interface CartItem {
//   product: Product;
//   quantity: number;
// }

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isCartLoaded: boolean;
}

const CART_STORAGE_KEY = "shopease-cart";

const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

interface CartProviderProps {
  children: ReactNode;
}

export default function CartProvider({
  children,
}: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load the saved cart once, after the component mounts.
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          setItems(parsed as CartItem[]);
        }
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  // Save cart changes only after the initial load completes.
  useEffect(() => {
    if (!isCartLoaded) return;

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch {
      // Storage may be unavailable or full.
    }
  }, [items, isCartLoaded]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        product.stock < 1
      ) {
        return;
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id,
        );

        if (existingItem) {
          return currentItems.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  product,
                  quantity: Math.min(
                    item.quantity + quantity,
                    product.stock,
                  ),
                }
              : item,
          );
        }

        return [
          ...currentItems,
          {
            product,
            quantity: Math.min(quantity, product.stock),
          },
        ];
      });
    },
    [],
  );

  const removeFromCart = useCallback((productId: number) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.product.id !== productId,
      ),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (!Number.isInteger(quantity) || quantity < 1) {
        removeFromCart(productId);
        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: Math.min(
                  quantity,
                  item.product.stock,
                ),
              }
            : item,
        ),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.product.price) * item.quantity,
    0,
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartLoaded,
    }),
    [
      items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartLoaded,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
