
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { messageApi } from "./message.api";
import { messageKeys } from "./message.keys";

export const useConversations = () =>
  useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: messageApi.getConversations,
  });

export const useConversation = (id: number) =>
  useQuery({
    queryKey: messageKeys.conversation(id),
    queryFn: () => messageApi.getConversation(id),
    enabled: Number.isFinite(id) && id > 0,
  });

export const useMessages = (
  conversationId: number,
  page = 1,
  limit = 30
) =>
  useQuery({
    queryKey: [
      ...messageKeys.messages(conversationId),
      page,
      limit,
    ],
    queryFn: () =>
      messageApi.getMessages(conversationId, page, limit),
    enabled: conversationId > 0,
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: messageKeys.unreadCount(),
    queryFn: messageApi.getUnreadCount,
    refetchInterval: 30000,
  });

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageApi.createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });
    },
  });
};

export const useSendMessage = (conversationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) =>
      messageApi.sendMessage(conversationId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.messages(conversationId),
      });

      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });

      queryClient.invalidateQueries({
        queryKey: messageKeys.unreadCount(),
      });
    },
  });
};

export const useMarkMessagesRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageApi.markAsRead,

    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.messages(conversationId),
      });

      queryClient.invalidateQueries({
        queryKey: messageKeys.unreadCount(),
      });
    },
  });
};

export const useAssignSupportAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      assignedToId,
    }: {
      conversationId: number;
      assignedToId: number;
    }) =>
      messageApi.assignSupportAgent(
        conversationId,
        assignedToId
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });

      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(
          variables.conversationId
        ),
      });
    },
  });
};
