import api from "@/lib/axiosInstance";

import type {
  StaffCustomer,
  StaffCustomersResponse,
} from "./customer.types";

export const getStaffCustomers = async (): Promise<StaffCustomer[]> => {
  const response = await api.get<StaffCustomersResponse>(
    "/staff/customers"
  );

  return response.data.data;
};