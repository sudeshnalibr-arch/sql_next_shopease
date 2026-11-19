
import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getMessageSocket = (): Socket => {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ||
        "http://localhost:3008",
      {
        withCredentials: true,
        autoConnect: false,
        transports: ["websocket", "polling"],
      }
    );
  }

  return socket;
};

export const connectMessageSocket = () => {
  const instance = getMessageSocket();

  if (!instance.connected) {
    instance.connect();
  }

  return instance;
};

export const disconnectMessageSocket = () => {
  socket?.disconnect();
};
