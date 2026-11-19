import { useQuery } from "@tanstack/react-query";

import { getStaffCustomers } from "./customer.api";

export const staffCustomerKeys = {
  all: ["staff-customers"] as const,
  list: () => [...staffCustomerKeys.all, "list"] as const,
};

export const useStaffCustomers = () => {
  return useQuery({
    queryKey: staffCustomerKeys.list(),
    queryFn: getStaffCustomers,
    staleTime: 60 * 1000,
    retry: 1,
  });
};