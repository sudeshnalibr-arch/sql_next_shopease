import api from "@/lib/axiosInstance";

import type {
  CustomerProfile,
  CustomerProfileResponse,
  UpdateCustomerProfilePayload,
} from "./profile.types";

export const getCustomerProfile =
  async (): Promise<CustomerProfile> => {
    const response = await api.get<CustomerProfileResponse>(
      "/users/profile"
    );

    return response.data.data;
  };

export const updateCustomerProfile = async (
  payload: UpdateCustomerProfilePayload
): Promise<CustomerProfile> => {
  const response = await api.patch<CustomerProfileResponse>(
    "/users/profile",
    payload
  );

  return response.data.data;
};