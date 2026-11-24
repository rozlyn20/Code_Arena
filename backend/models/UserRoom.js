const mongoose = require("mongoose");

// "Recent rooms" for logged-in users: one row per (user, room).
// This is only a convenience list. The room id itself is still what grants access,
// and removing a row never deletes the room's saved code.
const userRoomSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: String, required: true, maxlength: 100 },
  displayName: { type: String, trim: true, maxlength: 40, default: "" },
  lastOpened: { type: Date, default: Date.now },
});

userRoomSchema.index({ user: 1, roomId: 1 }, { unique: true });
userRoomSchema.index({ user: 1, lastOpened: -1 });

module.exports = mongoose.model("UserRoom", userRoomSchema);