
const {
  Review,
  Product,
  Order,
  OrderItem,
  User,
} = require("../models");

const AppError = require("../utils/AppError");
const { Op, UniqueConstraintError } = require("sequelize");

// ========================================
// CREATE PRODUCT REVIEW
// ========================================

const createReview = async (userId, productId, data) => {
  const { rating, comment, images = [] } = data;

  // Validate rating
  if (!Number.isInteger(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5) {
    throw new AppError("Rating must be between 1 and 5.", 400);
  }

  // Check product existence
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  // Check whether customer has purchased this product
  const orderItem = await OrderItem.findOne({
    where: {
      productId,
    },
    include: [
      {
        model: Order,
        as: "order",
        where: {
          userId,
          status: {
            [Op.in]: ["delivered", "completed"],
          },
        },
        attributes: ["id", "userId", "status"],
      },
    ],
  });

  if (!orderItem) {
    throw new AppError(
      "You can review this product only after purchasing and receiving it.",
      403
    );
  }

  const orderId = orderItem.order.id;

  // Check whether customer already reviewed this product
  const existingReview = await Review.findOne({
    where: {
      userId,
      productId,
    },
  });

  if (existingReview) {
    throw new AppError(
      "You have already reviewed this product.",
      409
    );
  }

  // Validate review images
  if (!Array.isArray(images)) {
    throw new AppError("Review images must be an array.", 400);
  }

  try {
    const review = await Review.create({
      userId,
      productId,
      orderId,
      rating: Number(rating),
      comment,
      images,
      isVerifiedPurchase: true,
    });

    return review;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "You have already reviewed this product.",
        409
      );
    }

    throw error;
  }
};


// ========================================
// GET ALL REVIEWS FOR A PRODUCT
// ========================================

const getProductReviews = async (productId, query = {}) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const offset = (page - 1) * limit;

  const where = { productId };

  if (query.rating) {
    const rating = Number(query.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new AppError("Rating filter must be between 1 and 5.", 400);
    }

    where.rating = rating;
  }

  const { count, rows } = await Review.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    reviews: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};


// ========================================
// UPDATE OWN REVIEW
// ========================================

const updateReview = async (userId, reviewId, data) => {
  const review = await Review.findOne({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  const allowedFields = ["rating", "comment", "images"];
  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  if (updates.rating !== undefined) {
    const rating = Number(updates.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5.", 400);
    }

    updates.rating = rating;
  }

  if (
    updates.images !== undefined &&
    !Array.isArray(updates.images)
  ) {
    throw new AppError("Review images must be an array.", 400);
  }

  await review.update(updates);

  return review;
};


// ========================================
// DELETE OWN REVIEW
// ========================================

const deleteReview = async (userId, reviewId) => {
  const review = await Review.findOne({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  await review.destroy();

  return { id: reviewId };
};


// ========================================
// GET PRODUCT RATING SUMMARY
// ========================================

const getRatingSummary = async (productId) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const result = await Review.findOne({
    where: { productId },
    attributes: [
      [Review.sequelize.fn("AVG", Review.sequelize.col("rating")), "averageRating"],
      [Review.sequelize.fn("COUNT", Review.sequelize.col("id")), "totalReviews"],
    ],
    raw: true,
  });

  return {
    averageRating: Number(Number(result.averageRating || 0).toFixed(1)),
    totalReviews: Number(result.totalReviews || 0),
  };
};


module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getRatingSummary,
};
