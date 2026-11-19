
const authService = require("../services/auth.service");

const isProduction = process.env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* =====================================================
   REGISTER
===================================================== */

const register = async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    data: { user },
  });
};

/* =====================================================
   LOGIN
===================================================== */

const login = async (req, res) => {
  const result = await authService.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    ...refreshCookieOptions,
  });

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

/* =====================================================
   REFRESH
   POST /api/auth/refresh
===================================================== */

const refresh = async (req, res) => {
  const result = await authService.refreshAccessToken(
    req.cookies?.refreshToken
  );

  // Replace the old refresh cookie with the rotated token.
  res.cookie("refreshToken", result.refreshToken, {
    ...refreshCookieOptions,
  });

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully.",
    data: {
      accessToken: result.accessToken,
    },
  });
};

/* =====================================================
   LOGOUT
   POST /api/auth/logout
===================================================== */

const logout = async (req, res) => {
  await authService.logoutUser(req.cookies?.refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
