
export const messageKeys = {
  all: ["messaging"] as const,

  conversations: () =>
    [...messageKeys.all, "conversations"] as const,

  conversation: (id: number) =>
    [...messageKeys.all, "conversation", id] as const,

  messages: (conversationId: number) =>
    [...messageKeys.all, "messages", conversationId] as const,

  unreadCount: () =>
    [...messageKeys.all, "unread-count"] as const,
};
