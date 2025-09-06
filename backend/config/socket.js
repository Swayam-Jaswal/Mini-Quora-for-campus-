const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

function initSocket(server, allowedOrigins) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    },
  });

  // 🔐 Authenticate socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // attach user info
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  // 🎯 Socket events
  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.user?.id} (${socket.user?.role})`);

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.user?.id}`);
    });
  });

  return io;
}

module.exports = initSocket;
