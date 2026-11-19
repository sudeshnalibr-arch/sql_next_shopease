// export interface MessageReceipt {
//   id: number;
//   messageId: number;
//   userId: number;
//   deliveredAt: string | null;
//   readAt: string | null;
// }

// export interface Message {
//   id: number;
//   conversationId: number;
//   senderId: number;
//   body: string;
//   createdAt: string;
//   sender?: {
//     id: number;
//     name: string;
//   };
//   receipts?: MessageReceipt[];
// }


export type ConversationType = "internal" | "support";

export type ConversationStatus = "open" | "closed";

export type MessageReceipt = {
  id: number;
  messageId: number;
  userId: number;
  deliveredAt: string | null;
  readAt: string | null;
};

export type MessageUser = {
  id: number;
  name: string;
  email?: string;
  role: "admin" | "manager" | "staff" | "customer";
};

export type Message = {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  messageType: "text" | "system";
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  sender?: MessageUser;
  receipts?: MessageReceipt[];
};

export type ConversationParticipant = {
  id: number;
  conversationId: number;
  userId: number;
  lastReadAt: string | null;
  participant: MessageUser;
};

export type Conversation = {
  id: number;
  type: ConversationType;
  title: string | null;
  createdById: number;
  assignedToId: number | null;
  status: ConversationStatus;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  participants: ConversationParticipant[];
  createdAt: string;
  updatedAt: string;
};

export type MessagePagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type MessageListResponse = {
  success: boolean;
  message: string;
  data: Message[];
  pagination: MessagePagination;
};
