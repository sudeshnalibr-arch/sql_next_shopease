import axiosInstance from "@/lib/axiosInstance";

import type {
  Payment,
  PaymentPayload,
  PaymentResponse,
  PaymentListResponse,
  GetPaymentsParams,
} from "@/types/payment.types";

// Create payment
export const createPayment = async (
  payload: PaymentPayload
): Promise<Payment> => {
  const response = await axiosInstance.post<PaymentResponse>(
    "/payments",
    payload
  );

  return response.data.data;
};

// Get logged-in user's payments
export const getMyPayments = async (
  params: GetPaymentsParams = {}
): Promise<PaymentListResponse> => {
  const response = await axiosInstance.get<PaymentListResponse>(
    "/payments/my",
    { params }
  );

  return response.data;
};

// Get payment by ID
export const getPaymentById = async (
  id: number
): Promise<Payment> => {
  const response = await axiosInstance.get<PaymentResponse>(
    `/payments/${id}`
  );

  return response.data.data;
};