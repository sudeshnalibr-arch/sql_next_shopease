
"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  useNotifications,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotifications";

import NotificationList from "./NotificationList";

interface NotificationDropdownProps {
  children: ReactElement;
}

export default function NotificationDropdown({
  children,
}: NotificationDropdownProps) {
  const {
    data,
    isLoading,
    isError,
  } = useNotifications({ page: 1, limit: 20 });

  const markAllAsReadMutation =
    useMarkAllNotificationsAsRead();

  const notifications = data?.data ?? [];

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <DropdownMenu>
      {/* Use the existing Button as the trigger.
          This prevents nested button elements. */}
      <DropdownMenuTrigger render={children} />

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[360px] overflow-hidden border border-orange-500/20 bg-[#120A05] p-0 text-orange-50 shadow-xl sm:w-[400px]"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: -8,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-orange-500/20 px-4 py-3">
            <div>
              <h3 className="font-semibold text-orange-50">
                Notifications
              </h3>

              <p className="text-xs text-orange-100/50">
                Stay updated with your latest activity
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={
                notifications.length === 0 ||
                markAllAsReadMutation.isPending
              }
              className="text-xs font-medium text-orange-400 transition hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {markAllAsReadMutation.isPending
                ? "Updating..."
                : "Mark all as read"}
            </button>
          </div>

          {/* Notification list */}
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            isError={isError}
          />
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
