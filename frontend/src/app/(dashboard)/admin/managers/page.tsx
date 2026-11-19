// src/app/admin/managers/page.tsx

"use client";

import AdminUserManagement from "@/components/admin/users/AdminUserManagement";

export default function ManagersPage() {
  return (
    <AdminUserManagement
      mode="manager"
      currentRole="admin"
    />
  );
}