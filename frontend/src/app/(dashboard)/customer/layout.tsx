import type { ReactNode } from "react";

import CustomerDashboardShell from "@/components/customer/CustomerDashboardShell";

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({
  children,
}: CustomerLayoutProps) {
  return (
    <CustomerDashboardShell>
      {children}
    </CustomerDashboardShell>
  );
}