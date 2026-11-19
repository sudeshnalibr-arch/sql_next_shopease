
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const registerMessagingHandlers = require("../socket/messaging.socket");

const {
  User,
  ConversationParticipant,
} = require("../models");

const {
  SocketEvents,
} = require("../constants/message.constants");

let io;

// userId -> Set of connected socket IDs
const onlineUsers = new Map();

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // ========================================
  // SOCKET AUTHENTICATION
  // ========================================

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(
        socket.handshake.headers.cookie || ""
      );

      const token =
        cookies[
          process.env.ACCESS_TOKEN_COOKIE_NAME || "accessToken"
        ];

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET ||
          process.env.JWT_SECRET
      );

      const userId =
        decoded.id || decoded.userId || decoded.sub;

      if (!userId) {
        return next(new Error("Invalid authentication token"));
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return next(new Error("User not found"));
      }

      if (user.isBlocked || user.isActive === false) {
        return next(new Error("Account is inactive"));
      }

      socket.data.user = {
        id: user.id,
        role: user.role,
      };

      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);
      next(new Error("Socket authentication failed"));
    }
  });

  // ========================================
  // SOCKET CONNECTION
  // ========================================

  io.on("connection", async (socket) => {
    const userId = socket.data.user.id;
    const userRoom = `user:${userId}`;

    socket.join(userRoom);
    registerMessagingHandlers(socket);

    // Track multiple tabs/devices
    const wasOffline = !onlineUsers.has(String(userId));

    if (!onlineUsers.has(String(userId))) {
      onlineUsers.set(String(userId), new Set());
    }

    onlineUsers.get(String(userId)).add(socket.id);

    if (wasOffline) {
      io.emit(SocketEvents.USER_ONLINE, {
        userId,
      });
    }

    console.log(`User ${userId} connected to Socket.IO`);

    // ========================================
    // JOIN CONVERSATION
    // ========================================

    socket.on("conversation:join", async (conversationId, callback) => {
      try {
        const membership =
          await ConversationParticipant.findOne({
            where: {
              conversationId,
              userId,
            },
          });

        if (!membership) {
          return callback?.({
            success: false,
            message: "You are not a participant in this conversation.",
          });
        }

        socket.join(`conversation:${conversationId}`);

        callback?.({
          success: true,
          message: "Joined conversation successfully.",
        });
      } catch (error) {
        console.error("Conversation join error:", error);

        callback?.({
          success: false,
          message: "Unable to join conversation.",
        });
      }
    });

    // ========================================
    // LEAVE CONVERSATION
    // ========================================

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // ========================================
    // TYPING START
    // ========================================

    socket.on(
      SocketEvents.TYPING_START,
      async ({ conversationId } = {}) => {
        try {
          if (!conversationId) return;

          const membership =
            await ConversationParticipant.findOne({
              where: {
                conversationId,
                userId,
              },
            });

          if (!membership) return;

          socket.to(`conversation:${conversationId}`).emit(
            SocketEvents.TYPING_START,
            {
              conversationId,
              userId,
            }
          );
        } catch (error) {
          console.error("Typing start error:", error);
        }
      }
    );

    // ========================================
    // TYPING STOP
    // ========================================

    socket.on(
      SocketEvents.TYPING_STOP,
      async ({ conversationId } = {}) => {
        try {
          if (!conversationId) return;

          const membership =
            await ConversationParticipant.findOne({
              where: {
                conversationId,
                userId,
              },
            });

          if (!membership) return;

          socket.to(`conversation:${conversationId}`).emit(
            SocketEvents.TYPING_STOP,
            {
              conversationId,
              userId,
            }
          );
        } catch (error) {
          console.error("Typing stop error:", error);
        }
      }
    );

    // ========================================
    // DISCONNECT
    // ========================================

    socket.on("disconnect", (reason) => {
      const sockets = onlineUsers.get(String(userId));

      if (sockets) {
        sockets.delete(socket.id);

        // Only mark offline when every tab/device disconnects
        if (sockets.size === 0) {
          onlineUsers.delete(String(userId));

          io.emit(SocketEvents.USER_OFFLINE, {
            userId,
          });
        }
      }

      console.log(`User ${userId} disconnected: ${reason}`);
    });
  });

  return io;
};

// ========================================
// GET SOCKET INSTANCE
// ========================================

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

// ========================================
// CHECK USER ONLINE STATUS
// ========================================

const isUserOnline = (userId) => {
  return onlineUsers.has(String(userId));
};

// ========================================
// GET ONLINE USER IDS
// ========================================

const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

module.exports = {
  initializeSocket,
  getIO,
  isUserOnline,
  getOnlineUsers,
};
