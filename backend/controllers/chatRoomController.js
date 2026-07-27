const crypto = require("crypto");
const ChatRoom = require("../models/ChatRoom");

async function listMyRooms(req, res) {
  try {
    const rooms = await ChatRoom.find({ members: req.user._id })
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ rooms });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load chat rooms." });
  }
}

async function createRoom(req, res) {
  try {
    const { roomName } = req.body;

    if (!roomName?.trim()) {
      return res.status(400).json({ message: "Room name is required." });
    }

    const room = await ChatRoom.create({
      roomId: crypto.randomUUID(),
      roomName: roomName.trim(),
      createdBy: req.user._id,
      members: [req.user._id],
    });

    return res.status(201).json({ room });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create chat room." });
  }
}

async function joinRoom(req, res) {
  try {
    const { roomId } = req.body;

    if (!roomId?.trim()) {
      return res.status(400).json({ message: "Room ID is required." });
    }

    const room = await ChatRoom.findOne({ roomId: roomId.trim() });

    if (!room) {
      return res.status(404).json({ message: "Chat room not found." });
    }

    if (!room.members.some((member) => member.equals(req.user._id))) {
      room.members.push(req.user._id);
      await room.save();
    }

    return res.status(200).json({ room });
  } catch (error) {
    return res.status(500).json({ message: "Unable to join chat room." });
  }
}

module.exports = { listMyRooms, createRoom, joinRoom };