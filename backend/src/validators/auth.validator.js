const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  email: Joi.string().trim().lowercase().email().max(150).required(),

  password: Joi.string()
    .min(8)
    .max(72)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
      "string.min": "Password must contain at least 8 characters",
    }),
}).unknown(false);

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(150).required(),
  password: Joi.string().min(1).max(72).required(),
}).unknown(false);

module.exports = {
  registerSchema,
  loginSchema,
};