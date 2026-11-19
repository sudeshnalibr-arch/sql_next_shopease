import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getStaffProfile,
  updateStaffProfile,
} from "./profile.api";

import type {
  UpdateStaffProfilePayload,
} from "./profile.types";

export const staffProfileKeys = {
  all: ["staff-profile"] as const,
  detail: () => [...staffProfileKeys.all, "detail"] as const,
};

export const useStaffProfile = () => {
  return useQuery({
    queryKey: staffProfileKeys.detail(),
    queryFn: getStaffProfile,
    staleTime: 60 * 1000,
  });
};

export const useUpdateStaffProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStaffProfilePayload) =>
      updateStaffProfile(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: staffProfileKeys.all,
      });
    },
  });
};