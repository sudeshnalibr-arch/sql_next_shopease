
const {
  sequelize,
  User,
  Conversation,
  ConversationParticipant,
} = require("../models");

const AppError = require("../utils/AppError");

const assignSupportAgent = async (
  conversationId,
  assignedToId,
  currentUser
) => {
  const transaction = await sequelize.transaction();

  try {
    const conversation = await Conversation.findByPk(
      conversationId,
      { transaction }
    );

    if (!conversation || conversation.type !== "support") {
      throw new AppError("Support conversation not found.", 404);
    }

    if (conversation.status !== "open") {
      throw new AppError("This conversation is closed.", 400);
    }

    if (!["admin", "manager"].includes(currentUser.role)) {
      throw new AppError(
        "You cannot assign support conversations.",
        403
      );
    }

    const agent = await User.findByPk(assignedToId, {
      transaction,
    });

    if (
      !agent ||
      agent.isActive === false ||
      agent.isBlocked
    ) {
      throw new AppError("Support agent not found or inactive.", 404);
    }

    if (!["manager", "staff"].includes(agent.role)) {
      throw new AppError(
        "Only managers or staff can be assigned.",
        400
      );
    }

    if (
      currentUser.role === "manager" &&
      (
        agent.role !== "staff" ||
        Number(agent.managerId) !== Number(currentUser.id)
      )
    ) {
      throw new AppError(
        "You can only assign your own staff members.",
        403
      );
    }

    await conversation.update(
      { assignedToId: agent.id },
      { transaction }
    );

    await ConversationParticipant.findOrCreate({
      where: {
        conversationId: conversation.id,
        userId: agent.id,
      },
      defaults: {
        conversationId: conversation.id,
        userId: agent.id,
      },
      transaction,
    });

    await transaction.commit();

    return Conversation.findByPk(conversation.id, {
      include: [
        {
          model: ConversationParticipant,
          as: "participants",
          include: [
            {
              model: User,
              as: "participant",
              attributes: ["id", "name", "email", "role"],
            },
          ],
        },
      ],
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = { assignSupportAgent };
