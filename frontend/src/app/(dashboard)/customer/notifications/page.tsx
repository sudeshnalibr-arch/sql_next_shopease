"use client";

import { CheckCheck } from "lucide-react";

import CustomerPageHeader from "@/components/customer/CustomerPageHeader";
import NotificationList from "@/components/customer/NotificationList";

import {
  useCustomerNotifications,
  useMarkCustomerNotificationRead,
  useMarkAllCustomerNotificationsRead,
} from "@/features/customers/notifications/notification.queries";

export default function CustomerNotificationsPage() {
  const { data, isLoading, isError } = useCustomerNotifications();

  const markRead = useMarkCustomerNotificationRead();
  const markAllRead = useMarkAllCustomerNotificationsRead();

  const unreadCount =
    data?.filter((notification) => !notification.isRead).length ?? 0;

  if (isLoading) {
    return <p className="text-gray-500">Loading notifications...</p>;
  }

  if (isError) {
    return <p className="text-red-600">Unable to load notifications.</p>;
  }

  return (
    <div>
      <CustomerPageHeader
        title="Notifications"
        description="Stay updated about your orders and offers."
        action={
          unreadCount > 0 ? (
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <CheckCheck size={17} />
              Mark All as Read
            </button>
          ) : undefined
        }
      />

      <NotificationList
        notifications={data ?? []}
        onMarkRead={(id) => markRead.mutate(id)}
      />

      {(markRead.isError || markAllRead.isError) && (
        <p className="mt-3 text-sm text-red-600">
          Unable to update notification status.
        </p>
      )}
    </div>
  );
}