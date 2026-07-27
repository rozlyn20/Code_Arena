const express = require("express");
const requireAuth = require("../middleware/authMiddleware");
const {
  listMyRooms,
  createRoom,
  joinRoom,
} = require("../controllers/chatRoomController");
const { getMessages } = require("../controllers/messageController");

const router = express.Router();

router.use(requireAuth);

router.get("/", listMyRooms);
router.post("/", createRoom);
router.post("/join", joinRoom);
router.get("/:roomId/messages", getMessages);

module.exports = router;