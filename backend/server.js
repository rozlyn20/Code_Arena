require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const registerChatSocket = require("./socket/chatSocket");
const authRoutes = require("./routes/authRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const runRoutes = require("./routes/runRoutes");
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";
const app = express();
connectDB();


app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
registerChatSocket(io);
app.use(express.json());
app.use("/api", runRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chatrooms", chatRoomRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("CodeArena Backend Running 🚀");
});

const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
   CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
};
const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId].username,
    })
  );
}

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {

    userSocketMap[socket.id] = {
      username,
      roomId,
    };
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    console.log("Clients in room:", clients);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    }
    );

    console.log(userSocketMap);
  });
  socket.on("code-change", ({ roomId, code }) => {
      console.log("====== SERVER ======");
  console.log(socket.id);
  console.log(roomId);
  console.log(code);
    console.log("Code received");
    socket.to(roomId).emit("code-change", {
      code,
    });
  });

socket.on(ACTIONS.SYNC_CODE, ({ code, targetSocketId }) => {
  io.to(targetSocketId).emit(ACTIONS.SYNC_CODE, {
    code,
  });
});
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userSocketMap[socket.id]?.username,
        });
      }
    });

    delete userSocketMap[socket.id];

    console.log("Socket disconnected:", socket.id);
  });
});



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});