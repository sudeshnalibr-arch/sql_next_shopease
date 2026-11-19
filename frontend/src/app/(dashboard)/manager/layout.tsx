"use client";

import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["manager"]}>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <div className="min-w-0 lg:pl-64">
          <DashboardHeader />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}