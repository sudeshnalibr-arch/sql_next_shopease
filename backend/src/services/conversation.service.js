
const {
  Conversation,
  ConversationParticipant,
  User,
  sequelize,
} = require("../models");

const { Op } = require("sequelize");

const AppError = require("../utils/AppError");

const getUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user || user.isActive === false || user.isBlocked) {
    throw new AppError("User not found or inactive.", 404);
  }

  return user;
};

const canStartInternalConversation = async (sender, recipient) => {
  if (sender.id === recipient.id) return false;

  if (sender.role === "admin") {
    return ["admin", "manager", "staff"].includes(recipient.role);
  }

  if (sender.role === "manager") {
    if (recipient.role === "admin") return true;

    return (
      recipient.role === "staff" &&
      Number(recipient.managerId) === Number(sender.id)
    );
  }

  if (sender.role === "staff") {
    if (recipient.role === "admin") return true;

    return (
      recipient.role === "manager" &&
      Number(sender.managerId) === Number(recipient.id)
    );
  }

  return false;
};

const createInternalConversation = async (
  senderId,
  recipientId
) => {
  const transaction = await sequelize.transaction();

  try {
    const sender = await getUser(senderId);
    const recipient = await getUser(recipientId);

    const allowed = await canStartInternalConversation(
      sender,
      recipient
    );

    if (!allowed) {
      throw new AppError(
        "You are not allowed to message this user.",
        403
      );
    }

    // Reuse an existing one-to-one conversation.
    const memberships = await ConversationParticipant.findAll({
      where: {
        userId: {
          [Op.in]: [sender.id, recipient.id],
        },
      },
      attributes: ["conversationId", "userId"],
      transaction,
    });

    const senderConversationIds = memberships
      .filter((item) => Number(item.userId) === Number(sender.id))
      .map((item) => item.conversationId);

    const recipientConversationIds = memberships
      .filter((item) => Number(item.userId) === Number(recipient.id))
      .map((item) => item.conversationId);

    const commonIds = senderConversationIds.filter((id) =>
      recipientConversationIds.some(
        (otherId) => Number(otherId) === Number(id)
      )
    );

    if (commonIds.length) {
      const existing = await Conversation.findOne({
        where: {
          id: { [Op.in]: commonIds },
          type: "internal",
          status: "open",
        },
        transaction,
      });

      if (existing) {
        await transaction.commit();
        return existing;
      }
    }

    const conversation = await Conversation.create(
      {
        type: "internal",
        createdById: sender.id,
      },
      { transaction }
    );

    await ConversationParticipant.bulkCreate(
      [
        {
          conversationId: conversation.id,
          userId: sender.id,
        },
        {
          conversationId: conversation.id,
          userId: recipient.id,
        },
      ],
      { transaction }
    );

    await transaction.commit();

    return conversation;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const createSupportConversation = async (customerId, body) => {
  const transaction = await sequelize.transaction();

  try {
    const customer = await getUser(customerId);

    if (customer.role !== "customer") {
      throw new AppError(
        "Only customers can create support conversations.",
        403
      );
    }

    const conversation = await Conversation.create(
      {
        type: "support",
        title: body.title || "Customer Support",
        createdById: customer.id,
        status: "open",
      },
      { transaction }
    );

    await ConversationParticipant.create(
      {
        conversationId: conversation.id,
        userId: customer.id,
      },
      { transaction }
    );

    await transaction.commit();

    return conversation;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getConversationById = async (conversationId, userId) => {
  const membership = await ConversationParticipant.findOne({
    where: { conversationId, userId },
  });

  if (!membership) {
    throw new AppError(
      "You do not have access to this conversation.",
      403
    );
  }

  return Conversation.findByPk(conversationId, {
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
};

const getMyConversations = async (userId) => {
  const memberships = await ConversationParticipant.findAll({
    where: { userId },
    attributes: ["conversationId", "lastReadAt"],
  });

  const ids = memberships.map((item) => item.conversationId);

  if (!ids.length) return [];

  return Conversation.findAll({
    where: { id: { [Op.in]: ids } },
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
    order: [["lastMessageAt", "DESC"], ["updatedAt", "DESC"]],
  });
};

module.exports = {
  createInternalConversation,
  createSupportConversation,
  getConversationById,
  getMyConversations,
};
