const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbCon");

module.exports = (sequelize) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue("code", value?.trim().toUpperCase());
        },
      },

      discountType: {
        type: DataTypes.ENUM("percentage", "fixed"),
        allowNull: false,
      },

      discountValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },

      minOrderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },

      maxDiscount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      usagePerUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "coupons",
      timestamps: true,
      indexes: [
        {
          fields: ["code"],
        },
      ],
    },
  );

  return Coupon;
};
