
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const reviewController = require("../controllers/review.controller");

// ========================================
// PUBLIC ROUTES
// ========================================

// Get all reviews of a product
router.get(
  "/products/:productId/reviews",
  reviewController.getProductReviews
);

// Get product rating summary
router.get(
  "/products/:productId/rating-summary",
  reviewController.getRatingSummary
);


// ========================================
// PROTECTED ROUTES
// ========================================

// Create product review
router.post(
  "/products/:productId/reviews",
  protect,
  reviewController.createReview
);

// Update own review
router.patch(
  "/:id",
  protect,
  reviewController.updateReview
);

// Delete own review
router.delete(
  "/:id",
  protect,
  reviewController.deleteReview
);

module.exports = router;
