
const conversationService = require("../services/conversation.service");
const AppError = require("../utils/AppError");

const createConversation = async (req, res, next) => {
  try {
    const { type, recipientId, title } = req.body;

    let conversation;

    if (type === "internal") {
      if (!recipientId) {
        throw new AppError("Recipient ID is required.", 400);
      }

      conversation =
        await conversationService.createInternalConversation(
          req.user.id,
          Number(recipientId)
        );
    } else if (type === "support") {
      conversation =
        await conversationService.createSupportConversation(
          req.user.id,
          { title }
        );
    } else {
      throw new AppError("Invalid conversation type.", 400);
    }

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

const getMyConversations = async (req, res, next) => {
  try {
    const conversations =
      await conversationService.getMyConversations(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Conversations retrieved successfully.",
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

const getConversation = async (req, res, next) => {
  try {
    const conversation =
      await conversationService.getConversationById(
        Number(req.params.id),
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message: "Conversation retrieved successfully.",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConversation,
  getMyConversations,
  getConversation,
};
