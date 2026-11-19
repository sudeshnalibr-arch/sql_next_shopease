
const { rolePermission } = require("../constants/permissions");
const AppError = require("../utils/AppError");

const checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    const permissions = rolePermission[userRole] || [];

    if (!permissions.includes(permission)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

module.exports = checkPermission;
