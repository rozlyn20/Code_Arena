import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { IndexeddbPersistence } from "y-indexeddb";
import { SocketIOProvider } from "./SocketIOProvider";
import { getIdentity, colorFor } from "./identity";

const API_BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

// One "channel" = one Y.Doc + its presence + local (IndexedDB) copy + server link.
function createChannel({ kind, roomId, socket, userKey, user, onSynced }) {
  const doc = new Y.Doc();
  const awareness = new Awareness(doc);
  awareness.setLocalStateField("user", user);

  // Offline copy in the browser. Works even if the server is unreachable.
  const idbName =
    kind === "main"
      ? `codearena:${roomId}:main`
      : `codearena:${roomId}:branch:${userKey}`;
  const persistence = new IndexeddbPersistence(idbName, doc);
  const provider = new SocketIOProvider({ socket, kind, doc, awareness, onSynced });

  return {
    kind,
    doc,
    awareness,
    text: doc.getText("code"),
    meta: doc.getMap("meta"),
    provider,
    persistence,
  };
}

export function useCollabRoom({ roomId, username }) {
  const [collab, setCollab] = useState(null); // { main, branch }
  const [connected, setConnected] = useState(false);
  const [synced, setSynced] = useState({ main: false, branch: false });
  const [peers, setPeers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId || !username) return undefined;

    const identity = getIdentity();
    const socket = io(`${API_BASE}/collab`, {
      auth: {
        roomId,
        username,
        token: identity.token,
        guestId: identity.guestId,
      },
    });

    const user = { name: username, userKey: identity.userKey, ...colorFor(identity.userKey) };
    const shared = { roomId, socket, userKey: identity.userKey, user };

    const main = createChannel({
      ...shared,
      kind: "main",
      onSynced: (v) => setSynced((s) => ({ ...s, main: v })),
    });
    const branch = createChannel({
      ...shared,
      kind: "branch",
      onSynced: (v) => setSynced((s) => ({ ...s, branch: v })),
    });

    const onConnect = () => {
      setConnected(true);
      setError(null);
    };
    const onDisconnect = () => setConnected(false);
    const onError = (err) => setError(err.message || "Connection failed");
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);

    // Presence list comes from the main doc's awareness. The same person in two
    // tabs is shown once.
    const refreshPeers = () => {
      const byKey = new Map();
      main.awareness.getStates().forEach((state, clientId) => {
        const u = state.user;
        if (!u) return;
        const prev = byKey.get(u.userKey);
        byKey.set(u.userKey, {
          ...(prev || u),
          clientId,
          isSelf: clientId === main.doc.clientID || prev?.isSelf || false,
        });
      });
      const list = Array.from(byKey.values()).sort((a, b) => Number(b.isSelf) - Number(a.isSelf));
      setPeers(list);
    };
    main.awareness.on("change", refreshPeers);
    refreshPeers();

    setCollab({ main, branch });

    return () => {
      main.awareness.off("change", refreshPeers);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);

      for (const ch of [main, branch]) {
        ch.provider.destroy();
        ch.persistence.destroy();
        ch.awareness.destroy();
        ch.doc.destroy();
      }
      socket.disconnect();
      setCollab(null);
      setConnected(false);
      setSynced({ main: false, branch: false });
      setPeers([]);
    };
  }, [roomId, username]);

  return { collab, connected, synced, peers, error };
}
