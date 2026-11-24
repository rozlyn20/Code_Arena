const UserRoom = require("../models/UserRoom");
const YDocState = require("../models/YDocState");
const { docName, guestBranchSuffix } = require("../collab/docNames");
const { mergeIntoBranch } = require("../collab/collabSocket");

const MAX_LIST = 20;
const GUEST_ID_RE = /^[0-9a-f-]{36}$/i;
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/rooms/recent
async function listRecent(req, res) {
  const rooms = await UserRoom.find({ user: req.user._id })
    .sort({ lastOpened: -1 })
    .limit(MAX_LIST)
    .lean();

  res.json({
    rooms: rooms.map((room) => ({
      roomId: room.roomId,
      username: room.displayName,
      lastOpened: room.lastOpened,
    })),
  });
}

// DELETE /api/rooms/recent/:roomId  (removes the list entry only)
async function removeRecent(req, res) {
  await UserRoom.deleteOne({ user: req.user._id, roomId: req.params.roomId });
  res.json({ ok: true });
}

// POST /api/rooms/import  { rooms: [{ roomId, username, lastOpened }] }
// Copies a guest's localStorage list into the account without clobbering newer data.
async function importRooms(req, res) {
  const list = Array.isArray(req.body?.rooms) ? req.body.rooms.slice(0, MAX_LIST) : [];
  const now = Date.now();
  const ops = [];

  for (const item of list) {
    const roomId = typeof item?.roomId === "string" ? item.roomId : "";
    if (!roomId || roomId.length > 100) continue;

    const opened = Number.isFinite(item.lastOpened) ? Math.min(item.lastOpened, now) : now;
    ops.push({
      updateOne: {
        filter: { user: req.user._id, roomId },
        update: {
          $max: { lastOpened: new Date(opened) },
          $setOnInsert: { displayName: String(item.username || "").slice(0, 40) },
        },
        upsert: true,
      },
    });
  }

  if (ops.length > 0) await UserRoom.bulkWrite(ops, { ordered: false });
  res.json({ imported: ops.length });
}

// POST /api/rooms/claim-guest  { guestId }
// Moves this browser's guest branches into the logged-in account.
//  - Branch exists only as guest   -> becomes the account's branch.
//  - Account already has a branch  -> both are merged with Yjs (nothing is lost).
// The guest row is deleted only AFTER the merged result is saved.
async function claimGuestData(req, res) {
  const { guestId } = req.body || {};
  if (typeof guestId !== "string" || !GUEST_ID_RE.test(guestId)) {
    return res.status(400).json({ message: "Invalid guest id." });
  }

  const accountId = String(req.user._id);
  const guestDocs = await YDocState.find({
    name: new RegExp(`${escapeRegex(guestBranchSuffix(guestId))}$`),
  });

  let claimed = 0;
  const historyOps = [];

  for (const guestDoc of guestDocs) {
    if (!guestDoc.roomId) continue;
    try {
      await mergeIntoBranch({
        name: docName(guestDoc.roomId, "branch", accountId),
        roomId: guestDoc.roomId,
        update: new Uint8Array(guestDoc.state),
      });
      await YDocState.deleteOne({ _id: guestDoc._id });
      claimed += 1;

      historyOps.push({
        updateOne: {
          filter: { user: req.user._id, roomId: guestDoc.roomId },
          update: { $max: { lastOpened: guestDoc.updatedAt || new Date() } },
          upsert: true,
        },
      });
    } catch (error) {
      console.error("[claim] failed for", guestDoc.name, error.message);
    }
  }

  if (historyOps.length > 0) await UserRoom.bulkWrite(historyOps, { ordered: false });
  res.json({ claimed });
}

module.exports = { listRecent, removeRecent, importRooms, claimGuestData };