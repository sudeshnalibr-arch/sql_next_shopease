
import axiosInstance from "@/lib/axiosInstance";

import type {
  Conversation,
  Message,
  MessageListResponse,
} from "./message.types";

export type CreateConversationInput =
  | {
      type: "internal";
      recipientId: number;
    }
  | {
      type: "support";
      title?: string;
    };

export const messageApi = {
  async getConversations(): Promise<Conversation[]> {
    const response = await axiosInstance.get(
      "/conversations"
    );

    return response.data.data;
  },

  async getConversation(id: number): Promise<Conversation> {
    const response = await axiosInstance.get(
      `/conversations/${id}`
    );

    return response.data.data;
  },

  async createConversation(
    input: CreateConversationInput
  ): Promise<Conversation> {
    const response = await axiosInstance.post(
      "/conversations",
      input
    );

    return response.data.data;
  },

  async getMessages(
    conversationId: number,
    page = 1,
    limit = 30
  ): Promise<MessageListResponse> {
    const response = await axiosInstance.get(
      `/messages/${conversationId}`,
      {
        params: { page, limit },
      }
    );

    return response.data;
  },

  async sendMessage(
    conversationId: number,
    body: string
  ): Promise<Message> {
    const response = await axiosInstance.post(
      `/messages/${conversationId}`,
      { body }
    );

    return response.data.data;
  },

  async markAsRead(conversationId: number) {
    const response = await axiosInstance.patch(
      `/messages/${conversationId}/read`
    );

    return response.data.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await axiosInstance.get(
      "/messages/unread-count"
    );

    return response.data.data.count;
  },

  async assignSupportAgent(
    conversationId: number,
    assignedToId: number
  ): Promise<Conversation> {
    const response = await axiosInstance.patch(
      `/support/${conversationId}/assign`,
      { assignedToId }
    );

    return response.data.data;
  },
};
