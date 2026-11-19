const crypto = require("crypto");

const { User, RefreshToken } = require("../models");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

// Hash the raw refresh token before storing or looking it up.
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Calculate refresh-token expiry for the database record.
const getRefreshExpiry = () => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  const match = expiresIn.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new AppError("Invalid JWT_REFRESH_EXPIRES_IN configuration.", 500);
  }

  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(Date.now() + Number(match[1]) * units[match[2]]);
};

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

/* =====================================================
   REGISTER
===================================================== */

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email is already registered.", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "customer",
  });

  return safeUser(user);
};

/* =====================================================
   LOGIN
===================================================== */

const loginUser = async ({ email, password }) => {
  const user = await User.scope("withPassword").findOne({
    where: { email },
  });

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!user.isActive) {
    throw new AppError("Your account is inactive.", 403);
  }

  const payload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshExpiry(),
  });

  return {
    user: safeUser(user),
    accessToken,
    refreshToken,
  };
};

/* =====================================================
   REFRESH ACCESS TOKEN
   Rotates the refresh token on each successful refresh.
===================================================== */

const refreshAccessToken = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    throw new AppError("Refresh token is required.", 401);
  }

  const decoded = verifyRefreshToken(rawRefreshToken);

  const existingToken = await RefreshToken.findOne({
    where: {
      userId: decoded.userId,
      tokenHash: hashToken(rawRefreshToken),
      revokedAt: null,
    },
  });

  if (!existingToken || existingToken.expiresAt.getTime() <= Date.now()) {
    throw new AppError("Refresh token is invalid, expired or revoked.", 401);
  }

  const user = await User.findByPk(decoded.userId);

  if (!user || !user.isActive) {
    await existingToken.update({ revokedAt: new Date() });

    throw new AppError("User account is unavailable.", 401);
  }

  // Revoke the old token before issuing its replacement.
  await existingToken.update({
    revokedAt: new Date(),
  });

  const payload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshExpiry(),
  });

  return {
    accessToken,
    refreshToken,
  };
};

/* =====================================================
   LOGOUT
===================================================== */

const logoutUser = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    // There is no token to revoke.
    return;
  }

  const decoded = jwt.decode(rawRefreshToken);

  if (!decoded || !decoded.userId) {
    return;
  }

  await RefreshToken.update(
    { revokedAt: new Date() },
    {
      where: {
        userId: decoded.userId,
        tokenHash: hashToken(rawRefreshToken),
        revokedAt: null,
      },
    },
  );
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
