const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      paymentGateway: {
        type: DataTypes.ENUM("razorpay", "stripe", "cod"),
        allowNull: false,
        defaultValue: "razorpay",
      },

      paymentMethod: {
        type: DataTypes.ENUM(
          "card",
          "upi",
          "netbanking",
          "wallet",
          "cod",
          "other"
        ),
        allowNull: false,
        defaultValue: "other",
      },

      transactionId: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: true,
      },

      gatewayOrderId: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      gatewayPaymentId: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: true,
      },

      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },

      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "INR",
      },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "processing",
          "succeeded",
          "failed",
          "refunded",
          "partially_refunded"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      refundedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      gatewayResponse: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "payments",
      timestamps: true,
      indexes: [
        {
          fields: ["orderId"],
        },
        {
          fields: ["userId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["paymentGateway"],
        },
      ],
    }
  );

  return Payment;
};