
"use client";

import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  useDeleteNotification,
  useMarkNotificationAsRead,
} from "@/hooks/useNotifications";

import type { Notification } from "@/features/notifications/notification.types";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  isError: boolean;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export default function NotificationList({
  notifications,
  isLoading,
  isError,
}: NotificationListProps) {
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteMutation = useDeleteNotification();

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-orange-100/60">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading notifications...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-10 text-center text-sm text-red-400">
        Unable to load notifications. Please try again.
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
        <Bell className="h-8 w-8 text-orange-500/40" />

        <p className="text-sm font-medium text-orange-50">
          No notifications yet
        </p>

        <p className="text-xs text-orange-100/50">
          You will see your latest updates here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`group border-b border-orange-500/10 px-4 py-3 transition hover:bg-orange-500/5 ${
            !notification.isRead ? "bg-orange-500/[0.07]" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
              <Bell className="h-4 w-4 text-orange-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-orange-50">
                  {notification.title}
                </p>

                {!notification.isRead && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                )}
              </div>

              <p className="mt-1 text-xs leading-5 text-orange-100/65">
                {notification.message}
              </p>

              <p className="mt-2 text-[11px] text-orange-100/40">
                {formatDate(notification.createdAt)}
              </p>

              <div className="mt-2 flex items-center gap-3">
                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() =>
                      handleMarkAsRead(notification.id)
                    }
                    disabled={markAsReadMutation.isPending}
                    className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 disabled:opacity-50"
                  >
                    <Check className="h-3 w-3" />
                    Mark as read
                  </button>
                )}

                {notification.isRead && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-500/80">
                    <CheckCheck className="h-3 w-3" />
                    Read
                  </span>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(notification.id)
                  }
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-1 text-xs text-red-400/70 transition hover:text-red-400 disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
