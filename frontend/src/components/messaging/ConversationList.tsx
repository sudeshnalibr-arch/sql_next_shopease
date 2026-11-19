
"use client";

import { useConversations } from "@/features/messaging/message.queries";

import { MessageCircle, Loader2 } from "lucide-react";

type Props = {
  selectedConversationId?: number;
  onSelect: (conversationId: number) => void;
};

export default function ConversationList({
  selectedConversationId,
  onSelect,
}: Props) {
  const { data, isLoading, isError } = useConversations();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="p-4 text-sm text-red-500">
        Unable to load conversations.
      </p>
    );
  }

  if (!data?.length) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {data.map((conversation) => (
        <button
          key={conversation.id}
          type="button"
          onClick={() => onSelect(conversation.id)}
          className={`flex w-full items-start gap-3 p-4 text-left transition hover:bg-orange-50 ${
            selectedConversationId === conversation.id
              ? "bg-orange-50"
              : "bg-white"
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <MessageCircle className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-gray-900">
                {conversation.title ||
                  (conversation.type === "support"
                    ? "Customer Support"
                    : "Internal Conversation")}
              </p>

              <span className="text-[10px] capitalize text-gray-400">
                {conversation.type}
              </span>
            </div>

            <p className="mt-1 truncate text-xs text-gray-500">
              {conversation.lastMessagePreview ||
                "No messages yet"}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
