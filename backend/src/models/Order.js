const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "confirmed",
          "shipped",
          "delivered",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      paymentStatus: {
        type: DataTypes.ENUM(
          "pending",
          "paid",
          "failed",
          "refunded"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      paymentMethod: {
        type: DataTypes.ENUM(
          "simulated",
          "card",
          "upi",
          "cod"
        ),
        allowNull: false,
        defaultValue: "simulated",
      },

      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      transactionId: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: true,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
      indexes: [
        { fields: ["userId"] },
        { fields: ["status"] },
        { fields: ["paymentStatus"] },
        { fields: ["createdAt"] },
      ],
    }
  );

  return Order;
};