
export const ROUTES = {
  HOME: "/",

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  PRODUCTS: {
    LIST: "/products",
    DETAILS: (id: number | string) => `/products/${id}`,
  },

  CART: "/cart",

  ORDERS: {
    LIST: "/orders",
    DETAILS: (id: number | string) => `/orders/${id}`,
  },

  ACCOUNT: "/account",
  PROFILE: "/profile",

  DASHBOARD: "/dashboard",

  ADMIN: {
    DASHBOARD: "/admin",
    USERS: "/admin/users",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
    ANALYTICS: "/admin/analytics",
  },

  MANAGER: {
    DASHBOARD: "/manager",
    USERS: "/manager/users",
    PRODUCTS: "/manager/products",
    ORDERS: "/manager/orders",
  },

  STAFF: {
    DASHBOARD: "/staff",
    PRODUCTS: "/staff/products",
    ORDERS: "/staff/orders",
  },

  NOT_FOUND: "/not-found",
  UNAUTHORIZED: "/unauthorized",

  CATEGORIES: {
  LIST: "/categories",
},

WISHLIST: "/wishlist",

PAYMENTS: {
  LIST: "/payments",
  DETAIL: (id: number) => `/payments/${id}`,
},
} as const;
