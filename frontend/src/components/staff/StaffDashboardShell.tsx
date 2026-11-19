"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import StaffSidebar from "./StaffSidebar";
import StaffHeader from "./StaffHeader";

interface StaffDashboardShellProps {
  children: ReactNode;
}

export default function StaffDashboardShell({
  children,
}: StaffDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <StaffHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}