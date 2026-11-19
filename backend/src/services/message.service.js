
const {
  sequelize,
  Conversation,
  ConversationParticipant,
  Message,
  MessageReceipt,
  User,
} = require("../models");

const { Op } = require("sequelize");
const AppError = require("../utils/AppError");

const sendMessage = async (conversationId, senderId, body) => {
  const text = String(body || "").trim();

  if (!text) {
    throw new AppError("Message cannot be empty.", 400);
  }

  if (text.length > 5000) {
    throw new AppError("Message cannot exceed 5000 characters.", 400);
  }

  const transaction = await sequelize.transaction();

  try {
    const conversation = await Conversation.findByPk(
      conversationId,
      { transaction, lock: transaction.LOCK.UPDATE }
    );

    if (!conversation || conversation.status !== "open") {
      throw new AppError("Conversation is not available.", 404);
    }

    const senderMembership =
      await ConversationParticipant.findOne({
        where: { conversationId, userId: senderId },
        transaction,
      });

    if (!senderMembership) {
      throw new AppError(
        "You are not a participant in this conversation.",
        403
      );
    }

    const message = await Message.create(
      {
        conversationId,
        senderId,
        body: text,
        messageType: "text",
      },
      { transaction }
    );

    const recipients = await ConversationParticipant.findAll({
      where: {
        conversationId,
        userId: { [Op.ne]: senderId },
      },
      transaction,
    });

    if (recipients.length) {
      await MessageReceipt.bulkCreate(
        recipients.map((participant) => ({
          messageId: message.id,
          userId: participant.userId,
        })),
        { transaction }
      );
    }

    await conversation.update(
      {
        lastMessageAt: message.createdAt,
        lastMessagePreview: text.slice(0, 200),
      },
      { transaction }
    );

    await transaction.commit();

    return Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "role"],
        },
        {
          model: MessageReceipt,
          as: "receipts",
        },
      ],
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getMessages = async (
  conversationId,
  userId,
  page = 1,
  limit = 30
) => {
  const membership = await ConversationParticipant.findOne({
    where: { conversationId, userId },
  });

  if (!membership) {
    throw new AppError("Access denied.", 403);
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 30));

  const result = await Message.findAndCountAll({
    where: {
      conversationId,
      deletedAt: null,
    },
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "name", "role"],
      },
      {
        model: MessageReceipt,
        as: "receipts",
      },
    ],
    order: [["createdAt", "DESC"], ["id", "DESC"]],
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
    distinct: true,
  });

  return {
    messages: result.rows.reverse(),
    pagination: {
      total: result.count,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(result.count / safeLimit),
    },
  };
};

const markConversationAsRead = async (
  conversationId,
  userId
) => {
  const transaction = await sequelize.transaction();

  try {
    const membership = await ConversationParticipant.findOne({
      where: { conversationId, userId },
      transaction,
    });

    if (!membership) {
      throw new AppError("Access denied.", 403);
    }

    const now = new Date();

    const receipts = await MessageReceipt.findAll({
      where: {
        userId,
        readAt: null,
      },
      include: [
        {
          model: Message,
          as: "message",
          where: {
            conversationId,
            senderId: { [Op.ne]: userId },
          },
          attributes: ["id"],
        },
      ],
      transaction,
    });

    if (receipts.length) {
      await MessageReceipt.update(
        {
          deliveredAt: now,
          readAt: now,
        },
        {
          where: {
            id: { [Op.in]: receipts.map((item) => item.id) },
          },
          transaction,
        }
      );
    }

    await membership.update(
      { lastReadAt: now },
      { transaction }
    );

    await transaction.commit();

    return {
      conversationId,
      userId,
      readAt: now,
      messageIds: receipts.map((item) => item.messageId),
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getUnreadCount = async (userId) => {
  return MessageReceipt.count({
    where: {
      userId,
      readAt: null,
    },
  });
};

module.exports = {
  sendMessage,
  getMessages,
  markConversationAsRead,
  getUnreadCount,
};
