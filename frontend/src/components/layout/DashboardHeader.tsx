
"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function formatTitle(pathname: string) {
  const segment = pathname.split("/").filter(Boolean).pop() ?? "Dashboard";

  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="flex min-h-16 items-center justify-between border-b px-4 sm:px-6">
      <div>
        <h1 className="text-lg font-semibold">{formatTitle(pathname)}</h1>
        <p className="text-xs text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </p>
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="rounded-full border p-2 hover:bg-muted"
      >
        <Bell className="size-5" />
      </button>
    </header>
  );
}
