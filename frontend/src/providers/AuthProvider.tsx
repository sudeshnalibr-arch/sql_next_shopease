
"use client";

import {
  createContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/features/auth/auth.queries";
import { useLogout } from "@/features/auth/auth.mutations";

import type { AuthUser} from "@/types/auth.types";
import type {UserRole} from "@/types/user.types"

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  logout: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const router = useRouter();

  const {
    data,
    isPending,
    isError,
  } = useCurrentUser();

  const logoutMutation = useLogout();

  // Adjust this extraction if your API returns a different shape.
  const user: AuthUser | null = data?.user ?? null;

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      // Clear local authentication state even if the request fails.
      router.push("/login");
      router.refresh();
    }
  }, [logoutMutation, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user) && !isError,
      isLoading: isPending,
      role: user?.role ?? null,
      logout,
    }),
    [user, isError, isPending, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
