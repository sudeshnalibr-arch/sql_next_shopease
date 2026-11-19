
import { ROLES, type UserRole } from "./roles";

export const PERMISSIONS = {
  CREATE_USER: "create_user",
  READ_USER: "read_user",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",

  CREATE_PRODUCT: "create_product",
  READ_PRODUCT: "read_product",
  UPDATE_PRODUCT: "update_product",
  DELETE_PRODUCT: "delete_product",

  CREATE_ORDER: "create_order",
  READ_ORDER: "read_order",
  UPDATE_ORDER: "update_order",
  CANCEL_ORDER: "cancel_order",

  VIEW_DASHBOARD: "view_dashboard",
  VIEW_ANALYTICS: "view_analytics",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.ADMIN]: ALL_PERMISSIONS,

  [ROLES.MANAGER]: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER,

    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.READ_PRODUCT,
    PERMISSIONS.UPDATE_PRODUCT,

    PERMISSIONS.READ_ORDER,
    PERMISSIONS.UPDATE_ORDER,

    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS,
  ],

  [ROLES.STAFF]: [
    PERMISSIONS.READ_USER,

    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.READ_PRODUCT,
    PERMISSIONS.UPDATE_PRODUCT,

    PERMISSIONS.READ_ORDER,
    PERMISSIONS.UPDATE_ORDER,

    PERMISSIONS.VIEW_DASHBOARD,
  ],

  [ROLES.CUSTOMER]: [
    PERMISSIONS.READ_PRODUCT,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.READ_ORDER,
    PERMISSIONS.CANCEL_ORDER,
  ],
};

export function hasPermission(
  role: UserRole | null | undefined,
  permission: Permission,
): boolean {
  if (!role) return false;

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
