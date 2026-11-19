import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCustomerProfile,
  updateCustomerProfile,
} from "./profile.api";

import type {
  UpdateCustomerProfilePayload,
} from "./profile.types";

export const customerProfileKeys = {
  all: ["customer-profile"] as const,
  detail: () => [...customerProfileKeys.all, "detail"] as const,
};

export const useCustomerProfile = () => {
  return useQuery({
    queryKey: customerProfileKeys.detail(),
    queryFn: getCustomerProfile,
    staleTime: 60 * 1000,
  });
};

export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCustomerProfilePayload) =>
      updateCustomerProfile(payload),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: customerProfileKeys.all,
      }),
  });
};