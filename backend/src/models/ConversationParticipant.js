
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "ConversationParticipant",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      conversationId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      lastReadAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "conversation_participants",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["conversationId", "userId"],
        },
        { fields: ["userId"] },
      ],
    }
  );
};
