const jwt = require("jsonwebtoken");
const Y = require("yjs");
const syncProtocol = require("y-protocols/sync");
const awarenessProtocol = require("y-protocols/awareness");
const encoding = require("lib0/encoding");
const decoding = require("lib0/decoding");
const User = require("../models/User");
const YDocState = require("../models/YDocState");
const UserRoom = require("../models/UserRoom");
const { docName } = require("./docNames");

const SAVE_DEBOUNCE_MS = 2000;
const KINDS = new Set(["main", "branch"]);
const GUEST_ID_RE = /^[0-9a-f-]{36}$/i;

// docName -> entry. An entry is one live Y.Doc plus its awareness (presence/cursors).
const entries = new Map();
let collabNs = null; // set in registerCollabSocket; used by mergeIntoBranch

/* ---------- persistence ---------- */

async function save(entry) {
  clearTimeout(entry.saveTimer);
  entry.saveTimer = null;
  if (!entry.dirty) return;
  entry.dirty = false;

  const state = Buffer.from(Y.encodeStateAsUpdate(entry.doc));
  try {
    await YDocState.updateOne(
      { name: entry.name },
      { $set: { state, roomId: entry.roomId, updatedAt: new Date() } },
      { upsert: true },
    );
  } catch (error) {
    entry.dirty = true; // try again on the next change / release
    throw error;
  }
}

function scheduleSave(entry) {
  entry.dirty = true;
  clearTimeout(entry.saveTimer);
  entry.saveTimer = setTimeout(() => {
    save(entry).catch((err) => console.error("[collab] save failed:", err.message));
  }, SAVE_DEBOUNCE_MS);
}

async function load(entry) {
  const saved = await YDocState.findOne({ name: entry.name });
  if (saved?.state) {
    Y.applyUpdate(entry.doc, new Uint8Array(saved.state));
  }
}

/* ---------- entry lifecycle ---------- */

function wire(ns, entry) {
  // Doc changes -> everyone in the doc's room except the socket that sent it.
  entry.doc.on("update", (update, origin) => {
    const enc = encoding.createEncoder();
    syncProtocol.writeUpdate(enc, update);
    const payload = encoding.toUint8Array(enc);

    if (origin && typeof origin.to === "function") {
      origin.to(entry.room).emit("sync", entry.kind, payload);
    } else {
      ns.to(entry.room).emit("sync", entry.kind, payload);
    }
    scheduleSave(entry);
  });

  // Presence/cursor changes -> everyone in the room, and remember which
  // awareness client ids each socket owns so we can clear them on disconnect.
  entry.awareness.on("update", ({ added, updated, removed }, origin) => {
    if (origin && origin.data && origin.data.controlled) {
      let ids = origin.data.controlled.get(entry.name);
      if (!ids) {
        ids = new Set();
        origin.data.controlled.set(entry.name, ids);
      }
      added.forEach((id) => ids.add(id));
      removed.forEach((id) => ids.delete(id));
    }

    const changed = added.concat(updated, removed);
    const buf = awarenessProtocol.encodeAwarenessUpdate(entry.awareness, changed);
    ns.to(entry.room).emit("awareness", entry.kind, buf);
  });
}

function getEntry(ns, { name, kind, roomId }) {
  let entry = entries.get(name);
  if (entry) return entry;

  const doc = new Y.Doc();
  const awareness = new awarenessProtocol.Awareness(doc);
  awareness.setLocalState(null); // the server itself has no cursor

  entry = {
    name,
    kind,
    roomId,
    room: `doc:${name}`,
    doc,
    awareness,
    sockets: new Set(),
    saveTimer: null,
    dirty: false,
    ready: null,
  };

  entry.ready = load(entry)
    .then(() => wire(ns, entry))
    .catch((err) => {
      entries.delete(name);
      throw err;
    });

  entries.set(name, entry);
  return entry;
}

// When the last socket leaves: flush to Mongo, then free the memory.
async function release(entry) {
  if (entry.sockets.size > 0) return;
  try {
    await save(entry);
  } catch (err) {
    console.error("[collab] final save failed:", err.message);
  }
  if (entry.sockets.size === 0 && entries.get(entry.name) === entry) {
    entries.delete(entry.name);
    entry.awareness.destroy();
    entry.doc.destroy();
  }
}

// Call on SIGTERM/SIGINT so a deploy or restart doesn't lose the last 2 seconds of edits.
async function flushAll() {
  await Promise.allSettled([...entries.values()].map((entry) => save(entry)));
}

// Merge a Yjs update into a user's branch document (used when a guest logs in
// and their private branches move to the account). It goes through the same
// in-memory entry that live sockets use, so a branch that is open in another
// tab is updated live and can't be overwritten by that tab's next save.
async function mergeIntoBranch({ name, roomId, update }) {
  if (!collabNs) throw new Error("Collab namespace is not ready.");
  const entry = getEntry(collabNs, { name, kind: "branch", roomId });
  await entry.ready;
  try {
    Y.applyUpdate(entry.doc, update, "claim");
    await save(entry);
  } finally {
    await release(entry);
  }
}

/* ---------- socket namespace ---------- */

async function authenticate(socket, next) {
  const { roomId, token, guestId, username } = socket.handshake.auth || {};

  if (typeof roomId !== "string" || !roomId || roomId.length > 100) {
    return next(new Error("A valid room id is required."));
  }
  socket.data.roomId = roomId;

  // Logged-in users: identity comes from the verified JWT, never from the client.
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.userId).select("username");
      if (user) {
        socket.data.userId = String(user._id);
        socket.data.username = user.username;
        socket.data.displayName = String(username || user.username).slice(0, 40);
        socket.data.isGuest = false;
        return next();
      }
    } catch {
      // expired/invalid token: fall through and treat as a guest if possible
    }
  }

  // Guests: a random UUID the browser keeps in localStorage.
  // Good enough to keep branches separate, NOT strong security (see "next steps").
  if (typeof guestId === "string" && GUEST_ID_RE.test(guestId)) {
    socket.data.userId = `guest:${guestId}`;
    socket.data.username = String(username || "Guest").slice(0, 40);
    socket.data.displayName = socket.data.username;
    socket.data.isGuest = true;
    return next();
  }

  return next(new Error("Identity required."));
}

function registerCollabSocket(io) {
  const ns = io.of("/collab");
  collabNs = ns;
  ns.use(authenticate);

  ns.on("connection", (socket) => {
    socket.data.joined = new Map(); // kind -> entry
    socket.data.controlled = new Map(); // docName -> Set<awareness clientId>

    // The client names only the *kind* of doc. The server decides the real
    // document name from the verified identity, so nobody can open someone
    // else's private branch by guessing a name.
    socket.on("doc:join", async (kind, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};
      try {
        if (!KINDS.has(kind)) return reply({ ok: false, message: "Unknown document." });
        if (socket.data.joined.has(kind)) return reply({ ok: true });

        const { roomId, userId } = socket.data;
        const entry = getEntry(ns, {
          name: docName(roomId, kind, userId),
          kind,
          roomId,
        });
        await entry.ready;

        if (socket.disconnected) {
          release(entry);
          return;
        }

        entry.sockets.add(socket);
        socket.data.joined.set(kind, entry);
        socket.join(entry.room);

        // Logged-in users get this room added to their account's recent rooms.
        // (Guests keep theirs in localStorage.) Fire-and-forget: never blocks joining.
        if (kind === "main" && !socket.data.isGuest) {
          UserRoom.updateOne(
            { user: userId, roomId },
            { $set: { lastOpened: new Date(), displayName: socket.data.displayName } },
            { upsert: true },
          ).catch((err) => console.error("[collab] history update failed:", err.message));
        }

        // Start the sync handshake: send what the server has (step 1).
        const enc = encoding.createEncoder();
        syncProtocol.writeSyncStep1(enc, entry.doc);
        socket.emit("sync", kind, encoding.toUint8Array(enc));

        // Tell the newcomer who is already here.
        const states = entry.awareness.getStates();
        if (states.size > 0) {
          socket.emit(
            "awareness",
            kind,
            awarenessProtocol.encodeAwarenessUpdate(entry.awareness, Array.from(states.keys())),
          );
        }

        reply({ ok: true });
      } catch (error) {
        console.error("[collab] join failed:", error.message);
        reply({ ok: false, message: "Unable to open document." });
      }
    });

    socket.on("sync", (kind, payload) => {
      const entry = socket.data.joined.get(kind);
      if (!entry || !payload) return;
      try {
        const decoder = decoding.createDecoder(new Uint8Array(payload));
        const encoder = encoding.createEncoder();
        syncProtocol.readSyncMessage(decoder, encoder, entry.doc, socket);
        if (encoding.length(encoder) > 0) {
          socket.emit("sync", kind, encoding.toUint8Array(encoder));
        }
      } catch (error) {
        console.error("[collab] bad sync message:", error.message);
      }
    });

    socket.on("awareness", (kind, payload) => {
      const entry = socket.data.joined.get(kind);
      if (!entry || !payload) return;
      try {
        awarenessProtocol.applyAwarenessUpdate(entry.awareness, new Uint8Array(payload), socket);
      } catch (error) {
        console.error("[collab] bad awareness message:", error.message);
      }
    });

    socket.on("disconnect", () => {
      for (const entry of socket.data.joined.values()) {
        entry.sockets.delete(socket);

        // Remove this socket's cursors so ghost users don't linger.
        const ids = socket.data.controlled.get(entry.name);
        if (ids && ids.size > 0) {
          awarenessProtocol.removeAwarenessStates(entry.awareness, Array.from(ids), null);
        }
        release(entry);
      }
    });
  });
}

module.exports = { registerCollabSocket, flushAll, mergeIntoBranch };