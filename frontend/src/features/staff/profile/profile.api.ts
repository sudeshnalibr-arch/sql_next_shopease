import api from "@/lib/axiosInstance";

import type {
  StaffProfile,
  StaffProfileResponse,
  UpdateStaffProfilePayload,
} from "./profile.types";

export const getStaffProfile = async (): Promise<StaffProfile> => {
  const response = await api.get<StaffProfileResponse>(
    "/users/profile"
  );

  return response.data.data;
};

export const updateStaffProfile = async (
  payload: UpdateStaffProfilePayload
): Promise<StaffProfile> => {
  const response = await api.patch<StaffProfileResponse>(
    "/users/profile",
    payload
  );

  return response.data.data;
};