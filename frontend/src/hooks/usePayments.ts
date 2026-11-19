// import {
//   useQuery,
//   useMutation,
// } from "@tanstack/react-query";

// import {
//   createPayment,
//   getMyPayments,
//   getPaymentById,
// } from "@/features/payments/api/paymentService";

// import type {
//   CreatePaymentPayload,
// } from "../types/payment.types";

// export const paymentKeys = {
//   all: ["payments"] as const,

//   lists: () => [...paymentKeys.all, "list"] as const,

//   list: (page: number, limit: number) =>
//     [...paymentKeys.lists(), page, limit] as const,

//   details: () => [...paymentKeys.all, "detail"] as const,

//   detail: (id: number) =>
//     [...paymentKeys.details(), id] as const,
// };

// // Create payment attempt
// export const useCreatePayment = () => {
//   return useMutation({
//     mutationFn: (payload: CreatePaymentPayload) =>
//       createPayment(payload),
//   });
// };

// // Get payment history
// export const useMyPayments = (
//   page = 1,
//   limit = 10
// ) => {
//   return useQuery({
//     queryKey: paymentKeys.list(page, limit),
//     queryFn: () => getMyPayments(page, limit),
//   });
// };

// // Get payment details
// export const usePayment = (id: number) => {
//   return useQuery({
//     queryKey: paymentKeys.detail(id),
//     queryFn: () => getPaymentById(id),
//     enabled: Number.isInteger(id) && id > 0,
//   });
// };

export {
  usePayment,
  useMyPayments,
  useCreatePayment,
  paymentKeys,
} from "@/features/payments/payment.query";