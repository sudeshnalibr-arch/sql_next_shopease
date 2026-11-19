"use client";

import {
  Bell,
  Check,
  Package,
  Tag,
  Info,
  ShoppingBag,
} from "lucide-react";

import type { CustomerNotification } from "@/features/customer/notifications/notification.types";

interface NotificationListProps {
  notifications: CustomerNotification[];
  onMarkRead: (id: number) => void;
}

const icons = {
  ORDER_UPDATE: ShoppingBag,
  NEW_PRODUCT: Package,
  PROMOTION: Tag,
  GENERAL: Info,
} as const;

export default function NotificationList({
  notifications,
  onMarkRead,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm">
        <Bell className="mx-auto text-gray-300" size={40} />
        <p className="mt-3 font-medium text-gray-700">
          No notifications yet
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Your updates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {notifications.map((notification) => {
        const Icon =
          icons[notification.type] ?? Info;

        return (
          <div
            key={notification.id}
            className={`flex gap-4 p-5 ${
              notification.isRead ? "bg-white" : "bg-orange-50/50"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Icon size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900">
                {notification.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {notification.message}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleString("en-IN")}
              </p>
            </div>

            {!notification.isRead && (
              <button
                onClick={() => onMarkRead(notification.id)}
                aria-label="Mark notification as read"
                className="h-fit rounded-lg p-2 text-green-600 hover:bg-green-50"
              >
                <Check size={18} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}