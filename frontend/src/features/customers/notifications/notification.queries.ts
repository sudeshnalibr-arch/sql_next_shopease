import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCustomerNotifications,
  markCustomerNotificationRead,
  markAllCustomerNotificationsRead,
} from "./notification.api";

export const customerNotificationKeys = {
  all: ["customer-notifications"] as const,
  list: () => [...customerNotificationKeys.all, "list"] as const,
};

export const useCustomerNotifications = () => {
  return useQuery({
    queryKey: customerNotificationKeys.list(),
    queryFn: getCustomerNotifications,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useMarkCustomerNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markCustomerNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: customerNotificationKeys.all,
      }),
  });
};

export const useMarkAllCustomerNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllCustomerNotificationsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: customerNotificationKeys.all,
      }),
  });
};