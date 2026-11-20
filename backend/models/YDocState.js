const mongoose = require("mongoose");

// One row per Yjs document. Two kinds exist per room:
//   "<roomId>:main"              -> the shared live document
//   "<roomId>:branch:<userId>"   -> one private branch per user
const yDocStateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  roomId: { type: String, index: true },
  state: { type: Buffer, required: true }, // Y.encodeStateAsUpdate(doc)
  // TTL: rooms nobody touched for 30 days are cleaned up automatically.
  updatedAt: { type: Date, default: Date.now, expires: "30d" },
});

module.exports = mongoose.model("YDocState", yDocStateSchema);
