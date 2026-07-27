const express = require("express");
const requireAuth = require("../middleware/authMiddleware");
const { createMessage } = require("../controllers/messageController");

const router = express.Router();

router.post("/", requireAuth, createMessage);

module.exports = router;