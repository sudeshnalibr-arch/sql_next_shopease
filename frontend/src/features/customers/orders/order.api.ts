import api from "@/lib/axiosInstance";

import type {
  CustomerOrder,
  CustomerOrdersResponse,
  CustomerOrderResponse,
} from "./customer-order.types";

export const getCustomerOrders =
  async (): Promise<CustomerOrder[]> => {
    const response = await api.get<CustomerOrdersResponse>(
      "/orders/my-orders"
    );

    return response.data.data;
  };

export const getCustomerOrderById =
  async (id: number | string): Promise<CustomerOrder> => {
    const response = await api.get<CustomerOrderResponse>(
      `/orders/${id}`
    );

    return response.data.data;
  };