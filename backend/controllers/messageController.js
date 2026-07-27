const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

async function getMessages(req, res) {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findOne({
      roomId,
      members: req.user._id,
    });

    if (!room) {
      return res.status(403).json({ message: "You are not a room member." });
    }

    const messages = await Message.find({ roomId })
      .populate("sender", "username email")
      .sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load messages." });
  }
}

async function createMessage(req, res) {
  try {
    const { roomId, text } = req.body;

    const room = await ChatRoom.findOne({
      roomId,
      members: req.user._id,
    });

    if (!room) {
      return res.status(403).json({ message: "You are not a room member." });
    }

    if (!text?.trim()) {
      return res.status(400).json({ message: "Message text is required." });
    }

    const message = await Message.create({
      roomId,
      sender: req.user._id,
      text: text.trim(),
    });

    await message.populate("sender", "username email");

    return res.status(201).json({ message });
  } catch (error) {
    return res.status(500).json({ message: "Unable to send message." });
  }
}

module.exports = { getMessages, createMessage };