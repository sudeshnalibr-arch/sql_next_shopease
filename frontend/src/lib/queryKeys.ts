
import type { UserFilters } from "@/types/user.types";
import type { ProductFilters } from "@/types/product.types.";
import type { OrderFilters } from "@/types/order.types";
import type { AnalyticsFilters } from "@/features/dashboard/dashboard.types";

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: UserFilters = {}) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: number | string) =>
      [...queryKeys.users.details(), id] as const,
  },

  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: ProductFilters = {}) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: number | string) =>
      [...queryKeys.products.details(), id] as const,
  },

  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (filters: OrderFilters = {}) =>
      [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: number | string) =>
      [...queryKeys.orders.details(), id] as const,
  },

  dashboard: {
    all: ["dashboard"] as const,
    overview: () => [...queryKeys.dashboard.all, "overview"] as const,
    analytics: (filters: AnalyticsFilters = {}) =>
      [...queryKeys.dashboard.all, "analytics", filters] as const,
  },
};
