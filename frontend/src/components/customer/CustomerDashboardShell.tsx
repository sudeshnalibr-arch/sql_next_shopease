"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomerHeader";

interface CustomerDashboardShellProps {
  children: ReactNode;
}

export default function CustomerDashboardShell({
  children,
}: CustomerDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <CustomerHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}