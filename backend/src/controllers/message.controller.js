
const messageService = require("../services/message.service");
const { getIO } = require("../config/socket");
const { SocketEvents } = require("../constants/message.constants");
const { ConversationParticipant } = require("../models");

const getMessages = async (req, res, next) => {
  try {
    const result = await messageService.getMessages(
      Number(req.params.conversationId),
      req.user.id,
      req.query.page,
      req.query.limit
    );

    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully.",
      data: result.messages,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.sendMessage(
      Number(req.params.conversationId),
      req.user.id,
      req.body.body
    );

    const io = getIO();

    // Notify every participant, including connected users
    // who have not opened the conversation room.
    const participants = await ConversationParticipant.findAll({
      where: { conversationId: message.conversationId },
      attributes: ["userId"],
    });

    for (const participant of participants) {
      io.to(`user:${participant.userId}`).emit(
        SocketEvents.MESSAGE_NEW,
        message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const result = await messageService.markConversationAsRead(
      Number(req.params.conversationId),
      req.user.id
    );

    const io = getIO();

    io.to(`conversation:${req.params.conversationId}`).emit(
      SocketEvents.MESSAGE_READ,
      result
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await messageService.getUnreadCount(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Unread count retrieved successfully.",
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount,
};
