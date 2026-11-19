export type PaymentGateway = "razorpay" | "stripe" | "cod";

export type PaymentMethod =
  | "card"
  | "upi"
  | "netbanking"
  | "wallet"
  | "cod"
  | "other";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded"
  | "partially_refunded";

export interface Payment {
  id: number;
  orderId: number;
  userId: number;

  paymentGateway: PaymentGateway;
  paymentMethod: PaymentMethod;

  transactionId: string | null;
  gatewayOrderId: string | null;
  gatewayPaymentId: string | null;

  amount: number;
  currency: string;

  status: PaymentStatus;

  failureReason: string | null;
  paidAt: string | null;
  refundedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentPayload {
  orderId: number;
  paymentGateway: PaymentGateway;
  paymentMethod: PaymentMethod;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: Payment;
}

export interface PaymentListResponse {
  success: boolean;
  message: string;
  data: Payment[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}

export interface PaymentPayload {
  orderId: number;
  paymentGateway: PaymentGateway;
  paymentMethod: PaymentMethod;
};

export interface GetPaymentsParams {
  page?: number;
  limit?: number;
}