
const sequelize = require("../config/dbCon");

// Initialize existing models
const User = require("./User")(sequelize);
const Category = require("./Category")(sequelize);
const Product = require("./Product")(sequelize);
const Order = require("./Order")(sequelize);
const OrderItem = require("./OrderItem")(sequelize);
const Task = require("./Task")(sequelize);
const RefreshToken = require("./RefreshToken");

const Wishlist = require("./Wishlist")(sequelize);
const Review = require("./Review")(sequelize);
const ProductImage = require("./ProductImage")(sequelize);
const Coupon = require("./Coupon")(sequelize);
const CouponUsage = require("./CouponUsage")(sequelize);
const OrderStatusHistory = require("./OrderStatusHistory")(sequelize);
const RecentlyViewed = require("./RecentlyViewed")(sequelize);
const Payment = require("./Payment")(sequelize);
const Notification = require("./Notification")(sequelize);

// ========================================
// MESSAGING MODELS
// ========================================

const Conversation = require("./Conversation")(sequelize);
const ConversationParticipant = require("./ConversationParticipant")(sequelize);
const Message = require("./Message")(sequelize);
const MessageReceipt = require("./MessageReceipt")(sequelize);


// ========================================
// USER AND ORDER
// ========================================

User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


// ========================================
// CATEGORY AND PRODUCT
// ========================================

Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});


// ========================================
// ORDER AND ORDER ITEM
// ========================================

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});


// ========================================
// PRODUCT AND ORDER ITEM
// ========================================

Product.hasMany(OrderItem, {
  foreignKey: "productId",
  as: "orderItems",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ========================================
// TASK AND USER
// ========================================

User.hasMany(Task, {
  foreignKey: "assignedBy",
  as: "assignedTasks",
});

User.hasMany(Task, {
  foreignKey: "assignedTo",
  as: "receivedTasks",
});

Task.belongsTo(User, {
  foreignKey: "assignedBy",
  as: "assigner",
});

Task.belongsTo(User, {
  foreignKey: "assignedTo",
  as: "assignee",
});


// ========================================
// REFRESH TOKEN AND USER
// ========================================

User.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
});

RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});


// ========================================
// WISHLIST AND USER
// ========================================

User.hasMany(Wishlist, {
  foreignKey: "userId",
  as: "wishlistItems",
  onDelete: "CASCADE",
});

Wishlist.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


// ========================================
// WISHLIST AND PRODUCT
// ========================================

Product.hasMany(Wishlist, {
  foreignKey: "productId",
  as: "wishlistedBy",
  onDelete: "CASCADE",
});

Wishlist.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ========================================
// PRODUCT AND PRODUCT IMAGE
// ========================================

Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "images",
  onDelete: "CASCADE",
});

ProductImage.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ========================================
// REVIEW AND USER
// ========================================

User.hasMany(Review, {
  foreignKey: "userId",
  as: "reviews",
  onDelete: "CASCADE",
});

Review.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


// ========================================
// REVIEW AND PRODUCT
// ========================================

Product.hasMany(Review, {
  foreignKey: "productId",
  as: "reviews",
  onDelete: "CASCADE",
});

Review.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ========================================
// REVIEW AND ORDER
// ========================================

Order.hasMany(Review, {
  foreignKey: "orderId",
  as: "reviews",
  onDelete: "RESTRICT",
});

Review.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});


// ========================================
// COUPON AND COUPON USAGE
// ========================================

Coupon.hasMany(CouponUsage, {
  foreignKey: "couponId",
  as: "usages",
  onDelete: "RESTRICT",
});

CouponUsage.belongsTo(Coupon, {
  foreignKey: "couponId",
  as: "coupon",
});


// ========================================
// USER AND COUPON USAGE
// ========================================

User.hasMany(CouponUsage, {
  foreignKey: "userId",
  as: "couponUsages",
  onDelete: "RESTRICT",
});

CouponUsage.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


// ========================================
// ORDER AND COUPON USAGE
// ========================================

Order.hasOne(CouponUsage, {
  foreignKey: "orderId",
  as: "couponUsage",
  onDelete: "RESTRICT",
});

CouponUsage.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});


// ========================================
// ORDER AND ORDER STATUS HISTORY
// ========================================

Order.hasMany(OrderStatusHistory, {
  foreignKey: "orderId",
  as: "statusHistory",
  onDelete: "CASCADE",
});

OrderStatusHistory.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});


// ========================================
// USER AND ORDER STATUS HISTORY
// ========================================

User.hasMany(OrderStatusHistory, {
  foreignKey: "changedBy",
  as: "orderStatusChanges",
});

OrderStatusHistory.belongsTo(User, {
  foreignKey: "changedBy",
  as: "changedByUser",
});


// ========================================
// RECENTLY VIEWED AND USER
// ========================================

User.hasMany(RecentlyViewed, {
  foreignKey: "userId",
  as: "recentlyViewed",
  onDelete: "CASCADE",
});

RecentlyViewed.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


// ========================================
// RECENTLY VIEWED AND PRODUCT
// ========================================

Product.hasMany(RecentlyViewed, {
  foreignKey: "productId",
  as: "recentlyViewedBy",
  onDelete: "CASCADE",
});

RecentlyViewed.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

// User and Payment
User.hasMany(Payment, {
  foreignKey: "userId",
  as: "payments",
});

Payment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Order and Payment
Order.hasMany(Payment, {
  foreignKey: "orderId",
  as: "payments",
});

Payment.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

//Notification and User
User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
});

Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

//Notification and Product
Product.hasMany(Notification, {
  foreignKey: "productId",
  as: "notifications",
});

Notification.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

// ========================================
// CONVERSATION AND USER
// ========================================

User.hasMany(Conversation, {
  foreignKey: "createdById",
  as: "createdConversations",
});

Conversation.belongsTo(User, {
  foreignKey: "createdById",
  as: "creator",
});

User.hasMany(Conversation, {
  foreignKey: "assignedToId",
  as: "assignedConversations",
});

Conversation.belongsTo(User, {
  foreignKey: "assignedToId",
  as: "assignedAgent",
});

// ========================================
// CONVERSATION PARTICIPANTS
// ========================================

Conversation.hasMany(ConversationParticipant, {
  foreignKey: "conversationId",
  as: "participants",
  onDelete: "CASCADE",
});

ConversationParticipant.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

User.hasMany(ConversationParticipant, {
  foreignKey: "userId",
  as: "conversationMemberships",
  onDelete: "CASCADE",
});

ConversationParticipant.belongsTo(User, {
  foreignKey: "userId",
  as: "participant",
});

// ========================================
// CONVERSATION AND MESSAGES
// ========================================

Conversation.hasMany(Message, {
  foreignKey: "conversationId",
  as: "messages",
  onDelete: "CASCADE",
});

Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

User.hasMany(Message, {
  foreignKey: "senderId",
  as: "sentMessages",
});

Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

// ========================================
// MESSAGE RECEIPTS
// ========================================

Message.hasMany(MessageReceipt, {
  foreignKey: "messageId",
  as: "receipts",
  onDelete: "CASCADE",
});

MessageReceipt.belongsTo(Message, {
  foreignKey: "messageId",
  as: "message",
});

User.hasMany(MessageReceipt, {
  foreignKey: "userId",
  as: "messageReceipts",
});

MessageReceipt.belongsTo(User, {
  foreignKey: "userId",
  as: "recipient",
});


// ========================================
// EXPORT ALL MODELS
// ========================================

module.exports = {
  sequelize,

  // Existing models
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Task,
  RefreshToken,
  Wishlist,
  Review,
  ProductImage,
  Coupon,
  CouponUsage,
  OrderStatusHistory,
  RecentlyViewed,
  Payment,
  Notification,
  Conversation,
  ConversationParticipant,
  Message,
  MessageReceipt,
};
