import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

import type {
  Order,
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderFilters,
  OrderListResponse,
} from "@/types/order.types";

export const ordersApi = {
  async getOrders(
    filters: OrderFilters = {},
  ): Promise<OrderListResponse> {
    const response = await axiosInstance.get<
      ApiResponse<OrderListResponse>
    >("/orders", {
      params: filters,
    });

    return response.data.data;
  },

  async getOrder(
    id: number | string,
  ): Promise<Order> {
    const response = await axiosInstance.get<
      ApiResponse<Order>
    >(`/orders/${id}`);

    return response.data.data;
  },

  async createOrder(
    input: CreateOrderInput,
  ): Promise<Order> {
    const response = await axiosInstance.post<
      ApiResponse<Order>
    >("/orders", input);

    return response.data.data;
  },

  async updateOrderStatus(
    id: number | string,
    input: UpdateOrderStatusInput,
  ): Promise<Order> {
    const response = await axiosInstance.patch<
      ApiResponse<Order>
    >(`/orders/${id}/status`, input);

    return response.data.data;
  },
};