const Joi = require("joi");

const productIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).unknown(false);

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),

  description: Joi.string().allow("").max(5000).optional(),

  categoryId: Joi.number().integer().positive().required(),

  price: Joi.number().precision(2).positive().max(99999999.99).required(),

  stock: Joi.number().integer().min(0).max(4294967295).required(),

  image: Joi.string().uri({ scheme: ["http", "https"] })
    .allow("")
    .max(500)
    .optional(),
}).unknown(false);

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).optional(),

  description: Joi.string().allow("").max(5000).optional(),

  categoryId: Joi.number().integer().positive().optional(),

  price: Joi.number().precision(2).positive().max(99999999.99).optional(),

  stock: Joi.number().integer().min(0).max(4294967295).optional(),

  image: Joi.string().uri({ scheme: ["http", "https"] })
    .allow("")
    .max(500)
    .optional(),

  isActive: Joi.boolean().optional(),
})
  .min(1)
  .unknown(false);

const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),

  search: Joi.string().trim().max(100).allow("").default(""),

  categoryId: Joi.number().integer().positive().optional(),

  minPrice: Joi.number().min(0).precision(2).optional(),
  maxPrice: Joi.number().min(0).precision(2).optional(),

  sortBy: Joi.string()
    .valid("name", "price", "createdAt")
    .default("createdAt"),

  sortOrder: Joi.string()
    .valid("ASC", "DESC", "asc", "desc")
    .uppercase()
    .default("DESC"),
})
  .custom((value, helpers) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.minPrice > value.maxPrice
    ) {
      return helpers.error("any.invalid");
    }

    return value;
  })
  .messages({
    "any.invalid": "minPrice cannot be greater than maxPrice",
  })
  .unknown(false);

module.exports = {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
};