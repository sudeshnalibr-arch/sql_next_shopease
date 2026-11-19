
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/user.types";
import { ROUTES } from "@/constants/routes";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps) {
  const router = useRouter();
  const { user, role, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(ROUTES.AUTH.LOGIN);
      return;
    }

    if (!role || !allowedRoles.includes(role)) {
      router.replace(ROUTES.UNAUTHORIZED);
    }
  }, [isLoading, isAuthenticated, user, role, allowedRoles, router]);

  if (isLoading) {
    return <div className="p-8 text-center">Checking access...</div>;
  }

  if (!isAuthenticated || !user || !role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
