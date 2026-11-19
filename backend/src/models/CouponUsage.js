const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbCon");

module.exports = (sequelize) => {
  const CouponUsage = sequelize.define(
    "CouponUsage",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      couponId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
      },

      discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },

      usedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "coupon_usages",
      timestamps: true,
      indexes: [
        {
          fields: ["couponId", "userId"],
        },
        {
          fields: ["userId"],
        },
      ],
    },
  );

  return CouponUsage;
};
