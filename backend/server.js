const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const runRoutes = require("./routes/runRoutes");

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(express.json());
app.use("/api", runRoutes);

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