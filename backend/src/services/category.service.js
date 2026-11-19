const { Category } = require("../models");
const { Op } = require("sequelize");
const AppError = require("../utils/AppError");

// Create category
const createCategory = async (data) => {
  const { name, description } = data;

  if (!name || !name.trim()) {
    throw new AppError("Category name is required.", 400);
  }

  const existingCategory = await Category.findOne({
    where: {
      name: name.trim(),
    },
  });

  if (existingCategory) {
    throw new AppError("Category already exists.", 409);
  }

  try {
    return await Category.create({
      name: name.trim(),
      description: description?.trim() || null,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError("Category already exists.", 409);
    }

    throw error;
  }
};

// Get all categories
const getAllCategories = async (query = {}) => {
  const { page = 1, limit = 10, search = "", isActive } = query;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const offset = (pageNumber - 1) * pageSize;

  const where = {};

  if (search.trim()) {
    where.name = {
      [Op.like]: `%${search.trim()}%`,
    };
  }

  if (isActive === "all") {
    // Admin can view both active and inactive categories.
  } else if (isActive !== undefined) {
    if (!["true", "false"].includes(String(isActive))) {
      throw new AppError("isActive must be true, false, or all.", 400);
    }

    where.isActive = String(isActive) === "true";
  } else {
    // Public listing shows only active categories.
    where.isActive = true;
  }

  const { count, rows } = await Category.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: pageSize,
    offset,
  });

  return {
    categories: rows,
    pagination: {
      totalItems: count,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageSize),
      pageSize,
    },
  };
};

// Get category by ID
const getCategoryById = async (id) => {
  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  return category;
};

// Update category
const updateCategory = async (id, updates) => {
  const category = await getCategoryById(id);

  const allowedFields = ["name", "description", "isActive"];

  const updateData = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError("No valid fields provided for update.", 400);
  }

  if (updateData.name !== undefined) {
    if (
      typeof updateData.name !== "string" ||
      updateData.name.trim().length < 2 ||
      updateData.name.trim().length > 100
    ) {
      throw new AppError(
        "Category name must contain between 2 and 100 characters.",
        400,
      );
    }

    updateData.name = updateData.name.trim();

    const existingCategory = await Category.findOne({
      where: {
        name: updateData.name,
        id: {
          [Op.ne]: id,
        },
      },
    });

    if (existingCategory) {
      throw new AppError("Category already exists.", 409);
    }
  }

  if (updateData.description !== undefined) {
    updateData.description = updateData.description?.trim() || null;
  }

  if (
    updateData.isActive !== undefined &&
    typeof updateData.isActive !== "boolean"
  ) {
    throw new AppError("isActive must be a boolean.", 400);
  }

  try {
    await category.update(updateData);
    return category;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new AppError("Category already exists.", 409);
    }

    throw error;
  }
};

// Soft delete / deactivate category
const deactivateCategory = async (id) => {
  const category = await getCategoryById(id);

  await category.update({
    isActive: false,
  });

  return category;
};

// Activate category
const activateCategory = async (id) => {
  const category = await getCategoryById(id);

  await category.update({
    isActive: true,
  });

  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory,
  activateCategory,
};
