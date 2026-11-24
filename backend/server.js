require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const registerChatSocket = require("./socket/chatSocket");
const { registerCollabSocket, flushAll } = require("./collab/collabSocket");
const authRoutes = require("./routes/authRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const runRoutes = require("./routes/runRoutes");
const roomHistoryRoutes = require("./routes/roomHistoryRoutes");
const app = express();
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://code-arena-gilt-six.vercel.app",
  "https://code-arena-rozlyn.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// /chat   -> persistent team chat (JWT)
// /collab -> Yjs real-time editing: shared "main" doc + private per-user branches
registerChatSocket(io);
registerCollabSocket(io);

app.use(express.json());
app.use("/api", runRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chatrooms", chatRoomRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomHistoryRoutes);


app.get("/", (req, res) => {
  res.send("CodeArena Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Hosts like Render send SIGTERM on every deploy. Save any unsaved editor state first.
async function shutdown(signal) {
  console.log(`${signal} received, flushing collaborative documents...`);
  try {
    await flushAll();
  } finally {
    process.exit(0);
  }
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
