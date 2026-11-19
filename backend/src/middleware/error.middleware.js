const AppError = require("../utils/AppError");

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Sequelize validation errors
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeBulkRecordError"
  ) {
    error = new AppError(
      err.errors?.map((item) => item.message).join(", ") ||
        "Database validation failed",
      400,
    );
  }

  // Duplicate unique-key errors
  else if (err.name === "SequelizeUniqueConstraintError") {
    error = new AppError("A record with this value already exists", 409);
  }

  // Foreign-key constraint errors
  else if (err.name === "SequelizeForeignKeyConstraintError") {
    error = new AppError(
      "Related record does not exist or cannot be modified",
      400,
    );
  }

  // Invalid database values or SQL constraints
  else if (
    err.name === "SequelizeDatabaseError" ||
    err.name === "SequelizeExclusionConstraintError"
  ) {
    console.error("Original error:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("SQL:", err.sql);
    console.error("Database error:", err.parent?.sqlMessage);
    error = new AppError("Invalid database operation", 400);
  }

  // JWT errors
  else if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid authentication token", 401);
  } else if (err.name === "TokenExpiredError") {
    error = new AppError("Authentication token has expired", 401);
  } else if (err.name === "NotBeforeError") {
    error = new AppError("Authentication token is not active", 401);
  }

  // Malformed JSON request body
  else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    error = new AppError("Invalid JSON request body", 400);
  }

  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500 && isProduction
        ? "Internal server error"
        : error.message || "Something went wrong",
    ...(isProduction
      ? {}
      : {
          stack: err.stack,
        }),
  });
};

module.exports = errorMiddleware;
