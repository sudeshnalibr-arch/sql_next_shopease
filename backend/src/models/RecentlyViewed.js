
const { DataTypes } = require("sequelize");


module.exports = (sequelize) => {
    const RecentlyViewed = sequelize.define(
  "RecentlyViewed",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    viewedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "recently_viewed",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
      },
      {
        fields: ["userId", "viewedAt"],
      },
    ],
  }
);

return RecentlyViewed;
}




