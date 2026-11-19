
const { User } = require("../models");
const AppError = require("../utils/AppError");
const asyncHandler = require("./asyncHandler");
const { verifyAccessToken } = require("../utils/jwt");

/* ==================================================
   VERIFY ACCESS TOKEN
================================================== */

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the access token from the Authorization header.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // login returns the access token in the response body.
  // Therefore, protected requests must send it as a Bearer token.
  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in first.", 401)
    );
  }

  // Verify using JWT_ACCESS_SECRET.
  const decoded = verifyAccessToken(token);

  // Find the user associated with the token.
  const user = await User.findByPk(decoded.userId);

  if (!user) {
    return next(
      new AppError(
        "The user associated with this token no longer exists.",
        401
      )
    );
  }

  if (!user.isActive) {
    return next(
      new AppError(
        "Your account is inactive. Please contact support.",
        403
      )
    );
  }

  // Always use the current role from the database.
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
});

/* ==================================================
   ROLE-BASED ACCESS
================================================== */

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError("Please log in to access this resource.", 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          403
        )
      );
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
