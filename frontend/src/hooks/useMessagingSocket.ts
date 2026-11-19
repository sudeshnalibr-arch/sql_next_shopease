
"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  connectMessageSocket,
  disconnectMessageSocket,
} from "@/features/messaging/message.socket";

import { messageKeys } from "@/features/messaging/message.keys";

import type { Message } from "@/features/messaging/message.types";

export function useMessagingSocket(
  conversationId?: number
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectMessageSocket();

    const handleNewMessage = (message: Message) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });

      queryClient.invalidateQueries({
        queryKey: messageKeys.unreadCount(),
      });

      // Update message lists for the currently open conversation.
      if (message.conversationId === conversationId) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.messages(conversationId),
        });
      }
    };

    const handleConversationUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      });

      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: messageKeys.conversation(conversationId),
        });
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:updated", handleConversationUpdate);

    if (conversationId) {
      socket.emit(
        "conversation:join",
        conversationId,
        (result: { success: boolean; message?: string }) => {
          if (!result?.success) {
            console.error(
              "Unable to join conversation:",
              result?.message
            );
          }
        }
      );
    }

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off(
        "conversation:updated",
        handleConversationUpdate
      );

      if (conversationId) {
        socket.emit("conversation:leave", conversationId);
      }

      // Do not disconnect here: another messaging component
      // may be using the shared connection.
    };
  }, [conversationId, queryClient]);
}
