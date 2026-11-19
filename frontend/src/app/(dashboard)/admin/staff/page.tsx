
"use client";

import AdminUserManagement from "@/components/admin/users/AdminUserManagement";

export default function StaffPage() {
  // Replace this with the role from your actual authentication state.
  // Admin can assign Staff to Managers.
  // Manager can create Staff under their own account.
  const currentRole: "admin" | "manager" = "admin";

  return (
    <AdminUserManagement
      mode="staff"
      currentRole={currentRole}
    />
  );
}
