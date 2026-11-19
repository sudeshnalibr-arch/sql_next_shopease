
const { Op } = require("sequelize");

const { User, RefreshToken } = require("../models");
const AppError = require("../utils/AppError");

const { UserRole } = require("../constants/permission");

const safeUserAttributes = [
  "id",
  "name",
  "email",
  "role",
  "managerId",
  "isActive",
  "createdAt",
  "updatedAt",
];

// ==========================================
// COMMON HELPERS
// ==========================================

const getActorId = (actor) => {
  const id = actor?.id ?? actor?.userId;

  if (id === undefined || id === null) {
    throw new AppError("Authenticated user ID is missing.", 401);
  }

  return id;
};

const getCurrentActor = async (actor) => {
  const actorId = getActorId(actor);

  const currentActor = await User.findByPk(actorId);

  if (!currentActor || !currentActor.isActive) {
    throw new AppError("Your account is unavailable.", 403);
  }

  return currentActor;
};

const requireRole = (actor, ...roles) => {
  if (!roles.includes(actor.role)) {
    throw new AppError(
      "You do not have permission to perform this action.",
      403
    );
  }
};

const normalizeEmail = (email) => {
  if (typeof email !== "string" || !email.trim()) {
    throw new AppError("A valid email address is required.", 400);
  }

  return email.trim().toLowerCase();
};

const findUserOrFail = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

const getSafeUser = async (userId) => {
  return User.findByPk(userId, {
    attributes: safeUserAttributes,
  });
};

const checkEmailExists = async (email, excludeId = null) => {
  const where = { email };

  if (excludeId !== null) {
    where.id = { [Op.ne]: excludeId };
  }

  const existingUser = await User.findOne({ where });

  if (existingUser) {
    throw new AppError("Email is already registered.", 409);
  }
};

const getPagination = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(query.limit, 10) || 10)
  );

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

const getActiveFilter = (value) => {
  if (value === undefined) return undefined;

  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;

  throw new AppError("isActive must be true or false.", 400);
};

const buildSearchCondition = (search) => {
  if (!search || typeof search !== "string" || !search.trim()) {
    return null;
  }

  const term = search.trim();

  return {
    [Op.or]: [
      { name: { [Op.like]: `%${term}%` } },
      { email: { [Op.like]: `%${term}%` } },
    ],
  };
};

const buildPaginationResponse = (result, page, limit) => ({
  data: result.rows,
  pagination: {
    total: result.count,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit),
  },
});

// ==========================================
// MANAGER MANAGEMENT
// ==========================================

// ADMIN: Create a manager
const createManager = async (data, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(currentActor, UserRole.ADMIN);

  const { name, password } = data;
  const email = normalizeEmail(data.email);

  if (typeof name !== "string" || !name.trim()) {
    throw new AppError("Name is required.", 400);
  }

  if (typeof password !== "string" || !password) {
    throw new AppError("Password is required.", 400);
  }

  await checkEmailExists(email);

  const manager = await User.create({
    name: name.trim(),
    email,
    password,
    role: UserRole.MANAGER,
    managerId: null,
  });

  return getSafeUser(manager.id);
};

const updateManager = async (managerId, data, actor) => {
  if (!actor || actor.role !== "admin") {
    throw new AppError("Only administrators can update managers.", 403);
  }

  const manager = await User.findOne({
    where: {
      id: managerId,
      role: UserRole.MANAGER,
    },
  });

  if (!manager) {
    throw new AppError("Manager not found.", 404);
  }

  const updates = {};

  if (data.name !== undefined) {
    updates.name = data.name.trim();
  }

  if (data.email !== undefined) {
    const email = data.email.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: {
        email,
        id: {
          [Op.ne]: manager.id,
        },
      },
    });

    if (existingUser) {
      throw new AppError("This email address is already in use.", 409);
    }

    updates.email = email;
  }

  await manager.update(updates);

  return {
    id: manager.id,
    name: manager.name,
    email: manager.email,
    role: manager.role,
    managerId: manager.managerId,
    isActive: manager.isActive,
    createdAt: manager.createdAt,
    updatedAt: manager.updatedAt,
  };
};

// ADMIN: Get all managers
const getAllManagers = async (query, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(currentActor, UserRole.ADMIN);

  const { page, limit, offset } = getPagination(query);
  const where = { role: UserRole.MANAGER };

  const activeFilter = getActiveFilter(query.isActive);

  if (activeFilter !== undefined) {
    where.isActive = activeFilter;
  }

  const searchCondition = buildSearchCondition(query.search);

  if (searchCondition) {
    Object.assign(where, searchCondition);
  }

  const result = await User.findAndCountAll({
    where,
    attributes: safeUserAttributes,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return buildPaginationResponse(result, page, limit);
};

// ==========================================
// STAFF MANAGEMENT
// ==========================================

// ADMIN or MANAGER: Create staff
const createStaff = async (data, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(
    currentActor,
    UserRole.ADMIN,
    UserRole.MANAGER
  );

  const { name, password } = data;
  const email = normalizeEmail(data.email);

  if (typeof name !== "string" || !name.trim()) {
    throw new AppError("Name is required.", 400);
  }

  if (typeof password !== "string" || !password) {
    throw new AppError("Password is required.", 400);
  }

  let managerId;

  if (currentActor.role === UserRole.MANAGER) {
    // Managers can create staff only for their own team.
    managerId = currentActor.id;
  } else {
    // Admin must select an active manager.
    if (!data.managerId) {
      throw new AppError(
        "Please assign a manager to this staff member.",
        400
      );
    }

    const manager = await User.findByPk(data.managerId);

    if (
      !manager ||
      !manager.isActive ||
      manager.role !== UserRole.MANAGER
    ) {
      throw new AppError(
        "Selected manager is invalid or inactive.",
        400
      );
    }

    managerId = manager.id;
  }

  await checkEmailExists(email);

  const staff = await User.create({
    name: name.trim(),
    email,
    password,
    role: UserRole.STAFF,
    managerId,
  });

  return getSafeUser(staff.id);
};

// ADMIN: All staff
// MANAGER: Only staff assigned to that manager
const getAllStaff = async (query, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(
    currentActor,
    UserRole.ADMIN,
    UserRole.MANAGER
  );

  const { page, limit, offset } = getPagination(query);

  const where = {
    role: UserRole.STAFF,
  };

  if (currentActor.role === UserRole.MANAGER) {
    where.managerId = currentActor.id;
  } else if (query.managerId) {
    where.managerId = query.managerId;
  }

  const activeFilter = getActiveFilter(query.isActive);

  if (activeFilter !== undefined) {
    where.isActive = activeFilter;
  }

  const searchCondition = buildSearchCondition(query.search);

  if (searchCondition) {
    Object.assign(where, searchCondition);
  }

  const result = await User.findAndCountAll({
    where,
    attributes: safeUserAttributes,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return buildPaginationResponse(result, page, limit);
};

// ADMIN: Any staff
// MANAGER: Own staff only
const getStaffById = async (staffId, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(
    currentActor,
    UserRole.ADMIN,
    UserRole.MANAGER
  );

  const staff = await findUserOrFail(staffId);

  if (staff.role !== UserRole.STAFF) {
    throw new AppError("The requested user is not a staff member.", 404);
  }

  if (
    currentActor.role === UserRole.MANAGER &&
    String(staff.managerId) !== String(currentActor.id)
  ) {
    throw new AppError(
      "You can view only staff members assigned to you.",
      403
    );
  }

  return getSafeUser(staff.id);
};

// ADMIN: Any staff
// MANAGER: Own staff only
const updateStaff = async (staffId, updates, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(
    currentActor,
    UserRole.ADMIN,
    UserRole.MANAGER
  );

  const staff = await findUserOrFail(staffId);

  if (staff.role !== UserRole.STAFF) {
    throw new AppError("The requested user is not a staff member.", 404);
  }

  if (
    currentActor.role === UserRole.MANAGER &&
    String(staff.managerId) !== String(currentActor.id)
  ) {
    throw new AppError(
      "You can update only staff members assigned to you.",
      403
    );
  }

  const allowedUpdates = {};

  if (updates.name !== undefined) {
    if (typeof updates.name !== "string" || !updates.name.trim()) {
      throw new AppError("Name cannot be empty.", 400);
    }

    allowedUpdates.name = updates.name.trim();
  }

  if (updates.email !== undefined) {
    const email = normalizeEmail(updates.email);

    await checkEmailExists(email, staff.id);

    allowedUpdates.email = email;
  }

  if (Object.keys(allowedUpdates).length === 0) {
    throw new AppError("No valid staff details were provided.", 400);
  }

  await staff.update(allowedUpdates);

  return getSafeUser(staff.id);
};

// ADMIN ONLY: Assign or reassign staff to a manager
const assignStaffToManager = async (staffId, managerId, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(currentActor, UserRole.ADMIN);

  if (!managerId) {
    throw new AppError("Manager ID is required.", 400);
  }

  const staff = await findUserOrFail(staffId);

  if (staff.role !== UserRole.STAFF) {
    throw new AppError("The selected user is not staff.", 400);
  }

  const manager = await User.findByPk(managerId);

  if (
    !manager ||
    manager.role !== UserRole.MANAGER ||
    !manager.isActive
  ) {
    throw new AppError(
      "Selected manager is invalid or inactive.",
      400
    );
  }

  await staff.update({
    managerId: manager.id,
  });

  return getSafeUser(staff.id);
};

// ADMIN: Any staff
// MANAGER: Own staff only
const deactivateStaff = async (staffId, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(
    currentActor,
    UserRole.ADMIN,
    UserRole.MANAGER
  );

  const staff = await findUserOrFail(staffId);

  if (staff.role !== UserRole.STAFF) {
    throw new AppError("The selected user is not staff.", 400);
  }

  if (
    currentActor.role === UserRole.MANAGER &&
    String(staff.managerId) !== String(currentActor.id)
  ) {
    throw new AppError(
      "You can deactivate only staff members assigned to you.",
      403
    );
  }

  if (!staff.isActive) {
    throw new AppError("This staff account is already inactive.", 400);
  }

  await staff.update({ isActive: false });

  // Revoke existing refresh tokens.
  if (RefreshToken) {
    await RefreshToken.update(
      { revokedAt: new Date() },
      {
        where: {
          userId: staff.id,
          revokedAt: null,
        },
      }
    );
  }

  return {
    id: staff.id,
    isActive: false,
  };
};


// ==========================================
// CUSTOMER MANAGEMENT
// ADMIN ONLY
// ==========================================

// Get all customers with pagination, search and active filter
const getAllCustomers = async (query, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(currentActor, UserRole.ADMIN);

  const { page, limit, offset } = getPagination(query);

  const where = {
    role: UserRole.CUSTOMER,
  };

  const activeFilter = getActiveFilter(query.isActive);

  if (activeFilter !== undefined) {
    where.isActive = activeFilter;
  }

  const searchCondition = buildSearchCondition(query.search);

  if (searchCondition) {
    Object.assign(where, searchCondition);
  }

  const result = await User.findAndCountAll({
    where,
    attributes: safeUserAttributes,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return buildPaginationResponse(result, page, limit);
};

// Get a single customer
const getCustomerById = async (customerId, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(currentActor, UserRole.ADMIN);

  const customer = await User.findOne({
    where: {
      id: customerId,
      role: UserRole.CUSTOMER,
    },
    attributes: safeUserAttributes,
  });

  if (!customer) {
    throw new AppError("Customer not found.", 404);
  }

  return customer;
};

// Admin updates customer details
const updateCustomer = async (customerId, data, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(currentActor, UserRole.ADMIN);

  const customer = await User.findOne({
    where: {
      id: customerId,
      role: UserRole.CUSTOMER,
    },
  });

  if (!customer) {
    throw new AppError("Customer not found.", 404);
  }

  const updates = {};

  if (data.name !== undefined) {
    if (
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {
      throw new AppError("Name cannot be empty.", 400);
    }

    updates.name = data.name.trim();
  }

  if (data.email !== undefined) {
    const email = normalizeEmail(data.email);

    await checkEmailExists(email, customer.id);

    updates.email = email;
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError(
      "No valid customer details were provided.",
      400
    );
  }

  await customer.update(updates);

  return getSafeUser(customer.id);
};

// Soft delete / deactivate a customer
const softDeleteCustomer = async (customerId, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(currentActor, UserRole.ADMIN);

  const customer = await User.findOne({
    where: {
      id: customerId,
      role: UserRole.CUSTOMER,
    },
  });

  if (!customer) {
    throw new AppError("Customer not found.", 404);
  }

  if (!customer.isActive) {
    throw new AppError(
      "This customer account is already inactive.",
      400
    );
  }

  await customer.update({
    isActive: false,
  });

  // Revoke all active refresh tokens.
  if (RefreshToken) {
    await RefreshToken.update(
      {
        revokedAt: new Date(),
      },
      {
        where: {
          userId: customer.id,
          revokedAt: null,
        },
      }
    );
  }

  return {
    id: customer.id,
    isActive: false,
  };
};

// ==========================================
// CUSTOMER PROFILE
// CUSTOMER SELF-SERVICE
// ==========================================

// Get the currently authenticated customer's profile
const getMyProfile = async (actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(currentActor, UserRole.CUSTOMER);

  return getSafeUser(currentActor.id);
};

// Customer updates their own profile
const updateMyProfile = async (data, actor) => {
  const currentActor = await getCurrentActor(actor);

  requireRole(currentActor, UserRole.CUSTOMER);

  const updates = {};

  if (data.name !== undefined) {
    if (
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {
      throw new AppError("Name cannot be empty.", 400);
    }

    updates.name = data.name.trim();
  }

  if (data.email !== undefined) {
    const email = normalizeEmail(data.email);

    await checkEmailExists(email, currentActor.id);

    updates.email = email;
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError(
      "No valid profile details were provided.",
      400
    );
  }

  await currentActor.update(updates);

  return getSafeUser(currentActor.id);
};



// ==========================================
// EXPORTS
// ==========================================

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

  // Customer management
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  softDeleteCustomer,

  // Customer profile
  getMyProfile,
  updateMyProfile,
};
