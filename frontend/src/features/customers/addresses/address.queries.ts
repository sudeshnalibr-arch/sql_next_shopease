import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
} from "./address.api";

import type { AddressPayload } from "./address.types";

export const customerAddressKeys = {
  all: ["customer-addresses"] as const,
  list: () => [...customerAddressKeys.all, "list"] as const,
};

export const useCustomerAddresses = () => {
  return useQuery({
    queryKey: customerAddressKeys.list(),
    queryFn: getCustomerAddresses,
    staleTime: 60 * 1000,
  });
};

export const useCreateCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddressPayload) =>
      createCustomerAddress(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: customerAddressKeys.all,
      }),
  });
};

export const useUpdateCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: AddressPayload;
    }) => updateCustomerAddress(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: customerAddressKeys.all,
      }),
  });
};

export const useDeleteCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerAddress,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: customerAddressKeys.all,
      }),
  });
};

export const useSetDefaultCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultCustomerAddress,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: customerAddressKeys.all,
      }),
  });
};