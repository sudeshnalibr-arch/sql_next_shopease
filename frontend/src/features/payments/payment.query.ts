import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPayment,
  getMyPayments,
  getPaymentById,
} from "./payment.api";

import type {
  PaymentPayload,
  GetPaymentsParams,
} from "@/types/payment.types";

// Query keys
export const paymentKeys = {
  all: ["payments"] as const,

  lists: () => [...paymentKeys.all, "list"] as const,

  myPayments: (params: GetPaymentsParams) =>
    [...paymentKeys.lists(), "my", params] as const,

  details: () => [...paymentKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...paymentKeys.details(), id] as const,
};

// Get logged-in user's payments
export const useMyPayments = (
  params: GetPaymentsParams = {}
) => {
  return useQuery({
    queryKey: paymentKeys.myPayments(params),
    queryFn: () => getMyPayments(params),
  });
};

// Get payment by ID
export const usePayment = (id: number) => {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => getPaymentById(id),
    enabled: Number.isInteger(id) && id > 0,
  });
};

// Create payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PaymentPayload) =>
      createPayment(payload),

    onSuccess: (payment) => {
      // Refresh payment list
      queryClient.invalidateQueries({
        queryKey: paymentKeys.all,
      });

      // Store newly created payment in detail cache
      queryClient.setQueryData(
        paymentKeys.detail(payment.id),
        payment
      );
    },
  });
};