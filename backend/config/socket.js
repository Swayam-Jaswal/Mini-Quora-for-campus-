const { Server } = require("socket.io");

module.exports = (server, allowedOrigins) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    // middleware (optional)
    next();
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);
    socket.join("announcements");
  });

  return io; // <--- Don't forget this
};
