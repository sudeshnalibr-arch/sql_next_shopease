// const userService = require("../services/user.service");

// const manageUsers = async (req, res) => {
//   const { method } = req;
//   const { id } = req.query;

//   switch (method) {
//     case "GET": {
//       if (id !== undefined) {
//        const user = await userService.getUserById(id, req.user);

//         return res.status(200).json({
//           success: true,
//           message: "User retrieved successfully.",
//           data: user,
//         });
//       }

//       const users = await userService.getAllUsers(req.user);

//       return res.status(200).json({
//         success: true,
//         message: "Users retrieved successfully.",
//         data: users,
//       });
//     }

//     case "POST": {
//       const user = await userService.createUser(req.body, req.user);

//       return res.status(201).json({
//         success: true,
//         message: "User created successfully.",
//         data: user,
//       });
//     }

//     case "PATCH": {
//       if (!id) {
//         return res.status(400).json({
//           success: false,
//           message: "User ID is required in the query string.",
//         });
//       }

//       const user = await userService.updateUser(id, req.body, req.user);

//       return res.status(200).json({
//         success: true,
//         message: "User updated successfully.",
//         data: user,
//       });
//     }

//     case "DELETE": {
//       if (!id) {
//         return res.status(400).json({
//           success: false,
//           message: "User ID is required in the query string.",
//         });
//       }

//       await userService.deleteUser(id, req.user);

//       return res.status(200).json({
//         success: true,
//         message: "User deactivated successfully.",
//       });
//     }

//     default:
//       return res.status(405).json({
//         success: false,
//         message: "HTTP method not allowed.",
//       });
//   }
// };

// module.exports = { manageUsers };



const userService = require("../services/user.service");

// ==========================================
// MANAGER MANAGEMENT
// ==========================================

// POST /api/admin/users/managers
const createManager = async (req, res) => {
  const manager = await userService.createManager(
    req.body,
    req.user
  );

  return res.status(201).json({
    success: true,
    message: "Manager created successfully.",
    data: manager,
  });
};

const updateManager = async (req, res) => {
  const manager = await userService.updateManager(
    req.params.id,
    req.body,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Manager updated successfully.",
    data: manager,
  });
};

// GET /api/admin/users/managers
const getAllManagers = async (req, res) => {
  const result = await userService.getAllManagers(
    req.query,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Managers retrieved successfully.",
    ...result,
  });
};

// ==========================================
// STAFF MANAGEMENT
// ==========================================

// POST /api/admin/users/staff
const createStaff = async (req, res) => {
  const staff = await userService.createStaff(
    req.body,
    req.user
  );

  return res.status(201).json({
    success: true,
    message: "Staff created successfully.",
    data: staff,
  });
};

// GET /api/admin/users/staff
const getAllStaff = async (req, res) => {
  const result = await userService.getAllStaff(
    req.query,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Staff retrieved successfully.",
    ...result,
  });
};

// GET /api/admin/users/staff/:id
const getStaffById = async (req, res) => {
  const staff = await userService.getStaffById(
    req.params.id,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Staff member retrieved successfully.",
    data: staff,
  });
};

// PATCH /api/admin/users/staff/:id
const updateStaff = async (req, res) => {
  const staff = await userService.updateStaff(
    req.params.id,
    req.body,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Staff details updated successfully.",
    data: staff,
  });
};

// PATCH /api/admin/users/staff/:id/assign-manager
const assignStaffToManager = async (req, res) => {
  const staff = await userService.assignStaffToManager(
    req.params.id,
    req.body.managerId,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Staff assigned to manager successfully.",
    data: staff,
  });
};

// PATCH /api/admin/users/staff/:id/deactivate
const deactivateStaff = async (req, res) => {
  await userService.deactivateStaff(
    req.params.id,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Staff account deactivated successfully.",
  });
};


// ==========================================
// CUSTOMER MANAGEMENT
// ==========================================

// GET /api/admin/users
const getAllCustomers = async (req, res) => {
  const result = await userService.getAllCustomers(
    req.query,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Customers retrieved successfully.",
    ...result,
  });
};

// GET /api/admin/users/:id
const getCustomerById = async (req, res) => {
  const customer = await userService.getCustomerById(
    req.params.id,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Customer retrieved successfully.",
    data: customer,
  });
};

// PATCH /api/admin/users/:id
const updateCustomer = async (req, res) => {
  const customer = await userService.updateCustomer(
    req.params.id,
    req.body,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Customer updated successfully.",
    data: customer,
  });
};

// PATCH /api/admin/users/:id/deactivate
const softDeleteCustomer = async (req, res) => {
  const customer = await userService.softDeleteCustomer(
    req.params.id,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Customer account deactivated successfully.",
    data: customer,
  });
};


// ==========================================
// CUSTOMER SELF-SERVICE PROFILE
// ==========================================

// GET /api/users/me
const getMyProfile = async (req, res) => {
  const profile = await userService.getMyProfile(req.user);

  return res.status(200).json({
    success: true,
    message: "Profile retrieved successfully.",
    data: profile,
  });
};

// PATCH /api/users/me
const updateMyProfile = async (req, res) => {
  const profile = await userService.updateMyProfile(
    req.body,
    req.user
  );

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: profile,
  });
};

module.exports = {
  createManager,
  updateManager,
  getAllManagers,
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  assignStaffToManager,
  deactivateStaff,
  getAllCustomers,
getCustomerById,
updateCustomer,
softDeleteCustomer,
getMyProfile,
updateMyProfile,
};
