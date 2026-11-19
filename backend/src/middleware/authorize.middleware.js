const {
  rolePermission,
} = require("../constants/permission");

const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      // Your authentication middleware must run first.
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const userRole = req.user.role;
      const allowedPermissions = rolePermission[userRole];

      if (!allowedPermissions) {
        return res.status(403).json({
          success: false,
          message: "Your role is not authorized.",
        });
      }

      const hasPermission = requiredPermissions.every(
        (permission) => allowedPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorize;