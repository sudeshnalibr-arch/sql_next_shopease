
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Conversation",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      type: {
        type: DataTypes.ENUM("internal", "support"),
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      createdById: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      assignedToId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("open", "closed"),
        allowNull: false,
        defaultValue: "open",
      },

      lastMessageAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      lastMessagePreview: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      tableName: "conversations",
      timestamps: true,
      indexes: [
        { fields: ["type"] },
        { fields: ["status"] },
        { fields: ["createdById"] },
        { fields: ["assignedToId"] },
        { fields: ["lastMessageAt"] },
      ],
    }
  );
};
