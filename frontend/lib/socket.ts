import { io, Socket } from "socket.io-client";
import { NotificationType } from "../types/notification";

interface ServerToClientEvents {
  notification: (data: {
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
  }) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ClientToServerEvents {
  // Add any client-to-server events here if needed
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const initializeSocket = (token: string) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Connected to notification server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from notification server");
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
