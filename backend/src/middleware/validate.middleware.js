
const AppError = require("../utils/AppError");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    if (!schema || typeof schema.validate !== "function") {
      return next(
        new AppError("Invalid validation schema configuration.", 500)
      );
    }

    if (!req[property]) {
      return next(
        new AppError(`Request ${property} is missing.`, 400)
      );
    }

    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const message = error.details
        .map((detail) => detail.message)
        .join(", ");

      return next(new AppError(message, 400));
    }

    req[property] = value;

    next();
  };
};

module.exports = validate;
