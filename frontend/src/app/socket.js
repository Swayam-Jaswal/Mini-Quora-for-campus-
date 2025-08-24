import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
