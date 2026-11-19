import type { ReactNode } from "react";

import StaffDashboardShell from "@/components/staff/StaffDashboardShell";

interface StaffLayoutProps {
  children: ReactNode;
}

export default function StaffLayout({
  children,
}: StaffLayoutProps) {
  return (
    <StaffDashboardShell>
      {children}
    </StaffDashboardShell>
  );
}