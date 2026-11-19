
"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useUnreadCount,
} from "@/hooks/useNotifications";

import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <NotificationDropdown>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative text-orange-100 hover:bg-orange-500/10 hover:text-orange-400"
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>
    </NotificationDropdown>
  );
}
