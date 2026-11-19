const Joi = require("joi");

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),

        quantity: Joi.number().integer().min(1).max(100).required(),
      }).unknown(false)
    )
    .min(1)
    .max(50)
    .unique("productId")
    .required(),
}).unknown(false);

const orderIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).unknown(false);

const orderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
}).unknown(false);

const salesQuerySchema = Joi.object({
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional(),
})
  .custom((value, helpers) => {
    if (
      value.from &&
      value.to &&
      new Date(value.from) > new Date(value.to)
    ) {
      return helpers.error("any.invalid");
    }

    return value;
  })
  .messages({
    "any.invalid": "'from' must be before or equal to 'to'",
  })
  .unknown(false);

module.exports = {
  createOrderSchema,
  orderIdSchema,
  orderQuerySchema,
  salesQuerySchema,
};