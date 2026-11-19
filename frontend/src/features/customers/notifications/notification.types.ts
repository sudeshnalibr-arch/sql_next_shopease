export type CustomerNotificationType =
  | "NEW_PRODUCT"
  | "ORDER_UPDATE"
  | "PROMOTION"
  | "GENERAL";

export interface CustomerNotification {
  id: number;
  title: string;
  message: string;
  type: CustomerNotificationType;
  isRead: boolean;
  createdAt: string;
  productId?: number | null;
}

export interface CustomerNotificationsResponse {
  success: boolean;
  message: string;
  data: CustomerNotification[];
}