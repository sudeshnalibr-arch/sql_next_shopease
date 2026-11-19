
const dashboardService = require("../services/dashboard.service");
const AppError = require("../utils/AppError");

const getDashboard = async (req, res) => {
  const role = req.user?.role;
  const userId = req.user?.id;

  let dashboard;

  switch (role) {
    case "admin":
      dashboard = await dashboardService.getAdminDashboard();
      break;

    case "manager":
      dashboard = await dashboardService.getManagerDashboard(userId);
      break;

    case "staff":
      dashboard = await dashboardService.getStaffDashboard(userId);
      break;

    case "customer":
      if (!userId) {
        throw new AppError("Authenticated user ID is missing.", 401);
      }

      dashboard = await dashboardService.getCustomerDashboard(userId);
      break;

    default:
      throw new AppError(
        "You are not authorized to access this dashboard.",
        403
      );
  }

  return res.status(200).json({
    success: true,
    message: "Dashboard data retrieved successfully.",
    data: dashboard,
  });
};

module.exports = { getDashboard };
