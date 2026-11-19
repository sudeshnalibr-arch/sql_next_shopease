
const {
  sendMessage,
} = require("../services/message.service");

const {
  ConversationParticipant,
} = require("../models");

const {
  getIO,
  isUserOnline,
} = require("../config/socket");

const {
  SocketEvents,
} = require("../constants/message.constants");

const registerMessagingHandlers = (socket) => {
  const senderId = socket.data.user.id;

  socket.on(SocketEvents.MESSAGE_SEND, async (payload, callback) => {
    try {
      const { conversationId, body } = payload || {};

      if (!conversationId || !body) {
        return callback?.({
          success: false,
          message: "Conversation ID and message are required.",
        });
      }

      const message = await sendMessage(
        Number(conversationId),
        senderId,
        body
      );

      const io = getIO();

      const participants = await ConversationParticipant.findAll({
        where: { conversationId: Number(conversationId) },
        attributes: ["userId"],
      });

      const recipients = participants.filter(
        (participant) =>
          Number(participant.userId) !== Number(senderId)
      );

      for (const participant of participants) {
        io.to(`user:${participant.userId}`).emit(
          SocketEvents.MESSAGE_NEW,
          message
        );
      }

      // Record delivery when the recipient has at least
      // one active socket connection.
      const deliveredUserIds = recipients
        .filter((participant) => isUserOnline(participant.userId))
        .map((participant) => participant.userId);

      if (deliveredUserIds.length) {
        const { MessageReceipt } = require("../models");

        const now = new Date();

        await MessageReceipt.update(
          { deliveredAt: now },
          {
            where: {
              messageId: message.id,
              userId: deliveredUserIds,
              deliveredAt: null,
            },
          }
        );

        io.to(`user:${senderId}`).emit(
          SocketEvents.MESSAGE_DELIVERED,
          {
            messageId: message.id,
            userIds: deliveredUserIds,
            deliveredAt: now,
          }
        );
      }

      callback?.({
        success: true,
        message: "Message sent successfully.",
        data: message,
      });
    } catch (error) {
      console.error("Socket message error:", error);

      callback?.({
        success: false,
        message: error.message || "Unable to send message.",
      });
    }
  });
};

module.exports = registerMessagingHandlers;
