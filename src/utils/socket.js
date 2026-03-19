import { io } from "socket.io-client";

// Create socket connection
// Use environment variable or default to localhost
import { API_BASE } from "./constants";

const SOCKET_URL = API_BASE;

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
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
