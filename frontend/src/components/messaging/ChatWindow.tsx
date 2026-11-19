
"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useMessages,
  useMarkMessagesRead,
  useSendMessage,
} from "@/features/messaging/message.queries";

import { useMessagingSocket } from "@/hooks/useMessagingSocket";
import { getMessageSocket } from "@/features/messaging/message.socket";
import { messageKeys } from "@/features/messaging/message.keys";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

import { Loader2, MessageCircle } from "lucide-react";

type Props = {
  conversationId: number;
  currentUserId: number;
  conversationTitle: string;
};

export default function ChatWindow({
  conversationId,
  currentUserId,
  conversationTitle,
}: Props) {
  const queryClient = useQueryClient();

  const [typingUsers, setTypingUsers] = useState<number[]>([]);

  const { data, isLoading, isError } = useMessages(
    conversationId
  );

  const sendMessage = useSendMessage(conversationId);
  const markAsRead = useMarkMessagesRead();

  useMessagingSocket(conversationId);

  useEffect(() => {
    if (conversationId) {
      markAsRead.mutate(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    const socket = getMessageSocket();

    const handleTypingStart = (data: {
      conversationId: number;
      userId: number;
    }) => {
      if (
        Number(data.conversationId) !== conversationId ||
        Number(data.userId) === currentUserId
      ) {
        return;
      }

      setTypingUsers((previous) =>
        previous.includes(data.userId)
          ? previous
          : [...previous, data.userId]
      );
    };

    const handleTypingStop = (data: {
      conversationId: number;
      userId: number;
    }) => {
      if (Number(data.conversationId) !== conversationId) return;

      setTypingUsers((previous) =>
        previous.filter((id) => id !== data.userId)
      );
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [conversationId, currentUserId]);

  const emitTyping = (event: "typing:start" | "typing:stop") => {
    getMessageSocket().emit(event, { conversationId });
  };

  const handleSend = async (body: string) => {
    await sendMessage.mutateAsync(body);

    // Refresh conversation preview and unread count.
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversations(),
      }),
      queryClient.invalidateQueries({
        queryKey: messageKeys.messages(conversationId),
      }),
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        Unable to load messages.
      </div>
    );
  }

  return (
    <section className="flex h-full min-h-[500px] flex-col overflow-hidden rounded-xl border bg-gray-50">
      <header className="flex items-center gap-3 border-b bg-white px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <MessageCircle className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            {conversationTitle}
          </h2>

          <p className="text-xs text-gray-500">
            ShopEase messaging
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {data?.data.length ? (
          data.data.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center text-sm text-gray-400">
            No messages yet. Start the conversation.
          </div>
        )}
      </div>

      <TypingIndicator
        typingUsers={typingUsers}
        currentUserId={currentUserId}
      />

      <MessageInput
        onSend={handleSend}
        onTypingStart={() => emitTyping("typing:start")}
        onTypingStop={() => emitTyping("typing:stop")}
        disabled={sendMessage.isPending}
      />
    </section>
  );
}
