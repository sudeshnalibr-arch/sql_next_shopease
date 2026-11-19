
const Joi = require("joi");

const { UserRole } = require("../constants/permission");

// ==========================================
// CREATE MANAGER
// POST /api/admin/users/managers
// ADMIN ONLY
// ==========================================

const createManagerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  email: Joi.string().trim().email().max(150).required(),

  password: Joi.string().min(8).max(72).required(),
}).unknown(false);

const updateManagerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().email().max(150),
})
  .min(1)
  .unknown(false);
// ==========================================
// CREATE STAFF
// POST /api/admin/users/staff
// ADMIN OR MANAGER
// ==========================================

const createStaffSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  email: Joi.string().trim().email().max(150).required(),

  password: Joi.string().min(8).max(72).required(),

  // Admin must provide managerId.
  // Manager's managerId is assigned by the service.
  managerId: Joi.number().integer().positive(),
}).unknown(false);

// ==========================================
// UPDATE STAFF
// PATCH /api/admin/users/staff/:id
// ADMIN OR MANAGER
// ==========================================

const updateStaffSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  email: Joi.string().trim().email().max(150),
})
  .min(1)
  .unknown(false);

// ==========================================
// ASSIGN STAFF TO MANAGER
// PATCH /api/admin/users/staff/:id/assign-manager
// ADMIN ONLY
// ==========================================

const assignStaffSchema = Joi.object({
  managerId: Joi.number().integer().positive().required(),
}).unknown(false);

module.exports = {
  createManagerSchema,
  createStaffSchema,
  updateStaffSchema,
  assignStaffSchema,
  updateManagerSchema
};
