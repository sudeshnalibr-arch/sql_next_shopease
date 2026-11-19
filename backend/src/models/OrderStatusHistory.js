const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbCon");

module.exports = (sequelize) => {
  const OrderStatusHistory = sequelize.define(
    "OrderStatusHistory",
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

      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      note: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      changedBy: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: "order_status_histories",
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          fields: ["orderId", "createdAt"],
        },
      ],
    },
  );

  return OrderStatusHistory
};


