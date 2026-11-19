
"use client";

type Props = {
  typingUsers: number[];
  currentUserId: number;
};

export default function TypingIndicator({
  typingUsers,
  currentUserId,
}: Props) {
  const activeUsers = typingUsers.filter(
    (id) => id !== currentUserId
  );

  if (!activeUsers.length) return null;

  return (
    <p className="px-4 py-2 text-xs italic text-gray-500">
      {activeUsers.length === 1
        ? "Someone is typing..."
        : `${activeUsers.length} people are typing...`}
    </p>
  );
}
