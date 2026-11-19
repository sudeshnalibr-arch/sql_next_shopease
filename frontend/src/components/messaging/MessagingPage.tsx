
"use client";

import { useState } from "react";

import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

import { useAuth } from "@/hooks/useAuth";

export default function MessagingPage() {
  const { user } = useAuth();

  const [selectedConversationId, setSelectedConversationId] =
    useState<number>();

  if (!user) {
    return (
      <div className="p-8 text-center">
        Please log in to access messages.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Messages
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Communicate with your ShopEase team and customers.
        </p>
      </div>

      <div className="grid min-h-[650px] grid-cols-1 overflow-hidden rounded-xl border bg-white md:grid-cols-[320px_1fr]">
        <aside className="border-r">
          <div className="border-b p-4">
            <h2 className="font-semibold">Conversations</h2>
          </div>

          <ConversationList
            selectedConversationId={selectedConversationId}
            onSelect={setSelectedConversationId}
          />
        </aside>

        <main className="min-w-0">
          {selectedConversationId ? (
            <ChatWindow
              conversationId={selectedConversationId}
              currentUserId={Number(user.id)}
              conversationTitle="ShopEase Conversation"
            />
          ) : (
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center text-gray-400">
              <p className="text-lg font-medium">
                Select a conversation
              </p>

              <p className="mt-2 text-sm">
                Choose a conversation to start messaging.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
