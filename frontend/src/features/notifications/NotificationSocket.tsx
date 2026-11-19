"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface NotificationSocketProps {
  enabled: boolean;
}

export default function NotificationSocket({
  enabled,
}: NotificationSocketProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ??
        "http://localhost:3008",
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      }
    );

    socket.on("connect", () => {
      console.log("Connected to notification socket");
    });

    socket.on("notification:new", (notification) => {
      console.log("New notification:", notification);

      // Refresh notification list and unread count
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast.info(notification.title, {
        description: notification.message,
      });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      socket.off("notification:new");
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [enabled, queryClient]);

  return null;
}