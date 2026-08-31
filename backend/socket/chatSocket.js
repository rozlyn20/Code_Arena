const jwt = require("jsonwebtoken");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const User = require("../models/User");

function registerChatSocket(io) {
  const chat = io.of("/chat");
//middleware to verify user authentication
  chat.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required."));
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.userId).select("-password");

      if (!user) {
        return next(new Error("User not found."));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token."));
    }
  });
//actual connection 
  chat.on("connection", (socket) => {
    socket.on("join-chat-room", async ({ roomId }, callback) => {
      try {
        const room = await ChatRoom.findOne({
          roomId,
          members: socket.user._id,
        });

        if (!room) {
          return callback?.({
            ok: false,
            message: "You are not a member of this chat room.",
          });
        }

        socket.join(roomId);

        const messages = await Message.find({ roomId })
          .populate("sender", "username email")
          .sort({ createdAt: 1 });

        socket.emit("chat-history", { roomId, messages });
        callback?.({ ok: true });
      } catch (error) {
        callback?.({
          ok: false,
          message: "Unable to join chat room.",
        });
      }
    });

    socket.on("leave-chat-room", ({ roomId }) => {
      socket.leave(roomId);
    });

    socket.on("send-message", async ({ roomId, text }, callback) => {
      try {
        const room = await ChatRoom.findOne({
          roomId,
          members: socket.user._id,
        });

        if (!room) {
          return callback?.({
            ok: false,
            message: "You are not a member of this chat room.",
          });
        }

        if (!text?.trim()) {
          return callback?.({
            ok: false,
            message: "Message cannot be empty.",
          });
        }

        const message = await Message.create({
          roomId,
          sender: socket.user._id,
          text: text.trim(),
        });

        await message.populate("sender", "username email");

        chat.to(roomId).emit("receive-message", { message });

        callback?.({ ok: true, message });
      } catch (error) {
        callback?.({
          ok: false,
          message: "Unable to send message.",
        });
      }
    });
  });
}

module.exports = registerChatSocket;