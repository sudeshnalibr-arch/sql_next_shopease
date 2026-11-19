import api from "@/lib/axiosInstance";

import type {
  CustomerAddress,
  AddressPayload,
  CustomerAddressesResponse,
  CustomerAddressResponse,
} from "./address.types";

export const getCustomerAddresses =
  async (): Promise<CustomerAddress[]> => {
    const response = await api.get<CustomerAddressesResponse>(
      "/addresses"
    );

    return response.data.data;
  };

export const createCustomerAddress = async (
  payload: AddressPayload
): Promise<CustomerAddress> => {
  const response = await api.post<CustomerAddressResponse>(
    "/addresses",
    payload
  );

  return response.data.data;
};

export const updateCustomerAddress = async (
  id: number,
  payload: AddressPayload
): Promise<CustomerAddress> => {
  const response = await api.patch<CustomerAddressResponse>(
    `/addresses/${id}`,
    payload
  );

  return response.data.data;
};

export const deleteCustomerAddress = async (
  id: number
): Promise<void> => {
  await api.delete(`/addresses/${id}`);
};

export const setDefaultCustomerAddress = async (
  id: number
): Promise<CustomerAddress> => {
  const response = await api.patch<CustomerAddressResponse>(
    `/addresses/${id}/default`
  );

  return response.data.data;
};