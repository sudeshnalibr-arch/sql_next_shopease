
import axiosInstance from "@/lib/axiosInstance";

import type {
    NotificationType,
    Notification,
    NotificationListResponse,
    NotificationResponse,
    UnreadCountResponse,
    NotificationQueryParams,
} from "./notification.types";

export const notificationApi = {
  // Get all notifications of the logged-in user
  async getNotifications(
    params: NotificationQueryParams = {}
  ): Promise<NotificationListResponse> {
    const response =
      await axiosInstance.get<NotificationListResponse>(
        "/notifications",
        { params }
      );

    return response.data;
  },

  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    const response =
      await axiosInstance.get<UnreadCountResponse>(
        "/notifications/unread-count"
      );

    return response.data.data.unreadCount;
  },

  // Mark a notification as read
  async markAsRead(id: number): Promise<Notification> {
    const response =
      await axiosInstance.patch<NotificationResponse>(
        `/notifications/${id}/read`
      );

    return response.data.data;
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await axiosInstance.patch("/notifications/read-all");
  },

  // Delete a notification
  async deleteNotification(id: number): Promise<void> {
    await axiosInstance.delete(`/notifications/${id}`);
  },
};
