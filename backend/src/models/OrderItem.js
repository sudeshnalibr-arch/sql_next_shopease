const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderItem = sequelize.define(
    "OrderItem",
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

      productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      productName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
        },
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },

      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
    },
    {
      tableName: "order_items",
      timestamps: true,
      indexes: [
        { fields: ["orderId"] },
        { fields: ["productId"] },
      ],
    }
  );

  return OrderItem;
};