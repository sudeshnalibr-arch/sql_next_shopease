
const jwt = require("jsonwebtoken");
const AppError = require("./AppError");

const generateAccessToken = (payload) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new AppError("JWT_ACCESS_SECRET is missing.", 500);
  }

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
};

const generateRefreshToken = (payload) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new AppError("JWT_REFRESH_SECRET is missing.", 500);
  }

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

const verifyAccessToken = (token) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new AppError("JWT_ACCESS_SECRET is missing.", 500);
  }

  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name
      )
    ) {
      throw new AppError("Invalid or expired access token.", 401);
    }

    throw error;
  }
};

const verifyRefreshToken = (token) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new AppError("JWT_REFRESH_SECRET is missing.", 500);
  }

  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name
      )
    ) {
      throw new AppError("Invalid or expired refresh token.", 401);
    }

    throw error;
  }
};

// Backward-compatible aliases for existing code.
// New code should use the explicit access-token names.
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateToken: generateAccessToken,
  verifyToken: verifyAccessToken,
};
