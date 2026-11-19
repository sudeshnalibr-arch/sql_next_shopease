const categoryService = require("../services/category.service");
const asyncHandler = require("../middleware/asyncHandler");

// Create category
const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    data: category,
  });
});

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getAllCategories(req.query);

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully.",
    data: result.categories,
    pagination: result.pagination,
  });
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category fetched successfully.",
    data: category,
  });
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully.",
    data: category,
  });
});

// Deactivate category
const deactivateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.deactivateCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deactivated successfully.",
    data: category,
  });
});

// Activate category
const activateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.activateCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category activated successfully.",
    data: category,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory,
  activateCategory,
};