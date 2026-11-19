
const reviewService = require("../services/review.service");
const asyncHandler = require("../middleware/asyncHandler");

// ========================================
// CREATE REVIEW
// ========================================

const createReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const result = await reviewService.createReview(
    userId,
    productId,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Product review submitted successfully.",
    data: result,
  });
});


// ========================================
// GET PRODUCT REVIEWS
// ========================================

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const result = await reviewService.getProductReviews(
    productId,
    req.query
  );

  res.status(200).json({
    success: true,
    message: "Product reviews fetched successfully.",
    data: result,
  });
});


// ========================================
// UPDATE OWN REVIEW
// ========================================

const updateReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const result = await reviewService.updateReview(
    userId,
    id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Review updated successfully.",
    data: result,
  });
});


// ========================================
// DELETE OWN REVIEW
// ========================================

const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const result = await reviewService.deleteReview(
    userId,
    id
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully.",
    data: result,
  });
});


// ========================================
// GET PRODUCT RATING SUMMARY
// ========================================

const getRatingSummary = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const result = await reviewService.getRatingSummary(productId);

  res.status(200).json({
    success: true,
    message: "Product rating summary fetched successfully.",
    data: result,
  });
});


module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getRatingSummary,
};
