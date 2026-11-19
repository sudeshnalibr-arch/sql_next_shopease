
"use client";

import { useEffect, useState } from "react";

import { connectMessageSocket } from "@/features/messaging/message.socket";

type Props = {
  userId: number;
};

export default function OnlineStatus({ userId }: Props) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const socket = connectMessageSocket();

    const handleOnline = (data: { userId: number }) => {
      if (Number(data.userId) === userId) {
        setIsOnline(true);
      }
    };

    const handleOffline = (data: { userId: number }) => {
      if (Number(data.userId) === userId) {
        setIsOnline(false);
      }
    };

    socket.on("user:online", handleOnline);
    socket.on("user:offline", handleOffline);

    return () => {
      socket.off("user:online", handleOnline);
      socket.off("user:offline", handleOffline);
    };
  }, [userId]);

  return (
    <span className="inline-flex items-center gap-2 text-xs text-gray-500">
      <span
        className={`h-2 w-2 rounded-full ${
          isOnline ? "bg-emerald-500" : "bg-gray-400"
        }`}
      />

      {isOnline ? "Online" : "Offline"}
    </span>
  );
}
