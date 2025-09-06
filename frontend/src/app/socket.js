import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const token = localStorage.getItem("token");

const socket = io(SOCKET_URL, {
  auth: { token },
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
