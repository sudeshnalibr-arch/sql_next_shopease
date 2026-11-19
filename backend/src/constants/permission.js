// const UserRole = Object.freeze({
//   ADMIN: "admin",
//   MANAGER: "manager",
//   STAFF: "staff",
//   CUSTOMER: "customer",
// });

// const Permission = Object.freeze({
//   CREATE_USER: "create_user",
//   READ_USER: "read_user",
//   UPDATE_USER: "update_user",
//   DELETE_USER: "delete_user",

//   CREATE_PRODUCT: "create_product",
//   READ_PRODUCT: "read_product",
//   UPDATE_PRODUCT: "update_product",
//   DELETE_PRODUCT: "delete_product",

//   READ_ORDER: "read_order",
//   UPDATE_ORDER: "update_order",
//   READ_ANALYTICS: "read_analytics",
// });

// const rolePermission = {
//   [UserRole.ADMIN]: Object.values(Permission),

//   [UserRole.MANAGER]: [
//     Permission.CREATE_USER,
//     Permission.READ_USER,
//     Permission.UPDATE_USER,

//     Permission.CREATE_PRODUCT,
//     Permission.READ_PRODUCT,
//     Permission.UPDATE_PRODUCT,

//     Permission.READ_ORDER,
//     Permission.UPDATE_ORDER,
//     Permission.READ_ANALYTICS,
//   ],

//   [UserRole.STAFF]: [
//     Permission.READ_USER,
//     Permission.READ_PRODUCT,
//     Permission.CREATE_PRODUCT,
//     Permission.READ_ORDER,
//     Permission.UPDATE_ORDER,
//   ],

//   [UserRole.CUSTOMER]: [
//     Permission.READ_PRODUCT,
//   ],
// };

// module.exports = {
//   UserRole,
//   Permission,
//   rolePermission,
// };


const UserRole = Object.freeze({
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  CUSTOMER: "customer",
});

const Permission = Object.freeze({
  // Manager management
  CREATE_MANAGER: "create_manager",
  READ_MANAGER: "read_manager",
  UPDATE_MANAGER: "update_manager",
  DELETE_MANAGER: "delete_manager",

  // Staff management
  CREATE_STAFF: "create_staff",
  READ_STAFF: "read_staff",
  UPDATE_STAFF: "update_staff",
  DELETE_STAFF: "delete_staff",

  // Product management
  CREATE_PRODUCT: "create_product",
  READ_PRODUCT: "read_product",
  UPDATE_PRODUCT: "update_product",
  DELETE_PRODUCT: "delete_product",

  // Order management
  READ_ORDER: "read_order",
  UPDATE_ORDER: "update_order",

  // Analytics
  READ_ANALYTICS: "read_analytics",
});

const rolePermission = {
  [UserRole.ADMIN]: Object.values(Permission),

  [UserRole.MANAGER]: [
    Permission.READ_STAFF,
    Permission.CREATE_STAFF,
    Permission.UPDATE_STAFF,
    Permission.DELETE_STAFF,

    Permission.CREATE_PRODUCT,
    Permission.READ_PRODUCT,
    Permission.UPDATE_PRODUCT,

    Permission.READ_ORDER,
    Permission.UPDATE_ORDER,
    Permission.READ_ANALYTICS,
  ],

  [UserRole.STAFF]: [
    Permission.READ_PRODUCT,
    Permission.CREATE_PRODUCT,
    Permission.READ_ORDER,
    Permission.UPDATE_ORDER,
  ],

  [UserRole.CUSTOMER]: [
    Permission.READ_PRODUCT,
  ],
};

module.exports = {
  UserRole,
  Permission,
  rolePermission,
};
