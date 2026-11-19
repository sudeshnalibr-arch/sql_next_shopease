
const ConversationType = Object.freeze({
  INTERNAL: "internal",
  SUPPORT: "support",
});

const ConversationStatus = Object.freeze({
  OPEN: "open",
  CLOSED: "closed",
});

const MessageType = Object.freeze({
  TEXT: "text",
  SYSTEM: "system",
});

const SocketEvents = Object.freeze({
  MESSAGE_SEND: "message:send",
  MESSAGE_NEW: "message:new",
  MESSAGE_DELIVERED: "message:delivered",
  MESSAGE_READ: "message:read",

  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",

  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",

  CONVERSATION_UPDATED: "conversation:updated",
  SOCKET_ERROR: "socket:error",
});

module.exports = {
  ConversationType,
  ConversationStatus,
  MessageType,
  SocketEvents,
};
