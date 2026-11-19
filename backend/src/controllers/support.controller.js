
const supportService = require("../services/support.service");
const { getIO } = require("../config/socket");
const { SocketEvents } = require("../constants/message.constants");

const assignAgent = async (req, res, next) => {
  try {
    const conversation = await supportService.assignSupportAgent(
      Number(req.params.conversationId),
      Number(req.body.assignedToId),
      {
        id: req.user.id,
        role: req.user.role,
      }
    );

    getIO().to(`conversation:${conversation.id}`).emit(
      SocketEvents.CONVERSATION_UPDATED,
      conversation
    );

    return res.status(200).json({
      success: true,
      message: "Support agent assigned successfully.",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { assignAgent };
