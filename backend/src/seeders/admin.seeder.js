
require("dotenv").config();

const { sequelize, User } = require("../models");

const createAdmin = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected.");

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );
    }

    if (password.length < 8 || password.length > 72) {
      throw new Error("Admin password must be between 8 and 72 characters.");
    }

    const existingAdmin = await User.findOne({
      where: { email },
    });

    if (existingAdmin) {
      throw new Error(
        "An account with this email already exists. No account was modified."
      );
    }

    const admin = await User.create({
      name: name.trim(),
      email,
      password,
      role: "admin",
      managerId: null,
      isActive: true,
    });

    console.log("Admin created successfully.");
    console.log({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

createAdmin();
