
"use client";

import type { Message } from "@/features/messaging/message.types";
import ReadReceipt from "./ReadReceipt";

type Props = {
  message: Message;
  currentUserId: number;
};

export default function MessageBubble({
  message,
  currentUserId,
}: Props) {
  const isMine = Number(message.senderId) === Number(currentUserId);

  const receipts = message.receipts ?? [];

  const allRead =
    receipts.length > 0 &&
    receipts.every((receipt) => Boolean(receipt.readAt));

  const allDelivered =
    receipts.length > 0 &&
    receipts.every((receipt) => Boolean(receipt.deliveredAt));

  const receiptStatus = allRead
    ? "read"
    : allDelivered
      ? "delivered"
      : "sent";

  return (
    <div
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
          isMine
            ? "rounded-br-sm bg-orange-500 text-white"
            : "rounded-bl-sm border bg-white text-gray-900"
        }`}
      >
        {!isMine && (
          <p className="mb-1 text-xs font-semibold text-orange-600">
            {message.sender?.name || "User"}
          </p>
        )}

        <p className="break-words text-sm whitespace-pre-wrap">
          {message.body}
        </p>

        <div
          className={`mt-2 flex items-center justify-end gap-2 text-[10px] ${
            isMine ? "text-orange-100" : "text-gray-400"
          }`}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isMine && (
            <ReadReceipt
              isOwnMessage={isMine}
              status={receiptStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}
