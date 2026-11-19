import api from "@/lib/axiosInstance";

import type {
  CustomerNotification,
  CustomerNotificationsResponse,
} from "./notification.types";

export const getCustomerNotifications =
  async (): Promise<CustomerNotification[]> => {
    const response =
      await api.get<CustomerNotificationsResponse>(
        "/notifications"
      );

    return response.data.data;
  };

export const markCustomerNotificationRead = async (
  id: number
): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllCustomerNotificationsRead =
  async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  };