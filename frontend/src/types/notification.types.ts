
export type NotificationType =
  | "NEW_PRODUCT"
  | "ORDER_UPDATE"
  | "PROMOTION"
  | "GENERAL";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  productId: number | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  success: boolean;
  message?: string;
  data: Notification[];
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  data: Notification;
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
}
