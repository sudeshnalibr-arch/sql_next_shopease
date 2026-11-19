"use client";

import AdminUserManagement from "@/components/admin/users/AdminUserManagement";

export default function ManagerStaffPage() {
  return (
    <AdminUserManagement
      mode="staff"
      currentRole="manager"
    />
  );
}