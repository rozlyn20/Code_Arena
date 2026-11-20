import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

/**
 * Connects ONE Y.Doc to the server's /collab namespace over an existing
 * Socket.IO socket. Several providers (e.g. "main" and "branch") can share a
 * single socket; the `kind` string routes messages to the right document.
 *
 * Offline/reconnect: Socket.IO reconnects automatically. On every (re)connect
 * we re-join and redo the Yjs sync handshake, which exchanges only what each
 * side is missing, so edits made while offline merge instead of being lost.
 */
export class SocketIOProvider {
  constructor({ socket, kind, doc, awareness, onSynced }) {
    this.socket = socket;
    this.kind = kind;
    this.doc = doc;
    this.awareness = awareness;
    this.onSynced = onSynced;
    this.synced = false;
    this.joined = false;

    // Local edit -> server
    this._onDocUpdate = (update, origin) => {
      if (origin === this || !this.socket.connected || !this.joined) return;
      const enc = encoding.createEncoder();
      syncProtocol.writeUpdate(enc, update);
      this.socket.emit("sync", this.kind, encoding.toUint8Array(enc));
    };

    // Local cursor/presence change -> server (remote ones are applied with origin=this)
    this._onAwarenessUpdate = ({ added, updated, removed }, origin) => {
      if (origin === this || !this.socket.connected || !this.joined) return;
      const changed = added.concat(updated, removed);
      this.socket.emit(
        "awareness",
        this.kind,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, changed),
      );
    };

    // Server -> me
    this._onSync = (kind, payload) => {
      if (kind !== this.kind) return;
      const decoder = decoding.createDecoder(new Uint8Array(payload));
      const encoder = encoding.createEncoder();
      const type = syncProtocol.readSyncMessage(decoder, encoder, this.doc, this);

      if (type === syncProtocol.messageYjsSyncStep2 && !this.synced) {
        this.synced = true;
        this.onSynced?.(true);
      }
      if (encoding.length(encoder) > 0) {
        this.socket.emit("sync", this.kind, encoding.toUint8Array(encoder));
      }
    };

    this._onAwareness = (kind, payload) => {
      if (kind !== this.kind) return;
      awarenessProtocol.applyAwarenessUpdate(this.awareness, new Uint8Array(payload), this);
    };

    this._join = () => {
      this.joined = false;
      this.socket.emit("doc:join", this.kind, (res) => {
        if (!res?.ok) return;
        this.joined = true;

        // Our half of the handshake: ask the server for what we're missing...
        const enc = encoding.createEncoder();
        syncProtocol.writeSyncStep1(enc, this.doc);
        this.socket.emit("sync", this.kind, encoding.toUint8Array(enc));

        // ...and announce where our cursor is.
        if (this.awareness.getLocalState() !== null) {
          this.socket.emit(
            "awareness",
            this.kind,
            awarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID]),
          );
        }
      });
    };

    this._onDisconnect = () => {
      this.joined = false;
      if (this.synced) {
        this.synced = false;
        this.onSynced?.(false);
      }
      // Drop everyone else's cursors; they'll be re-sent after reconnecting.
      const others = Array.from(this.awareness.getStates().keys()).filter(
        (id) => id !== this.doc.clientID,
      );
      awarenessProtocol.removeAwarenessStates(this.awareness, others, this);
    };

    this.doc.on("update", this._onDocUpdate);
    this.awareness.on("update", this._onAwarenessUpdate);
    this.socket.on("sync", this._onSync);
    this.socket.on("awareness", this._onAwareness);
    this.socket.on("connect", this._join);
    this.socket.on("disconnect", this._onDisconnect);

    if (this.socket.connected) this._join();
  }

  destroy() {
    this.doc.off("update", this._onDocUpdate);
    this.awareness.off("update", this._onAwarenessUpdate);
    this.socket.off("sync", this._onSync);
    this.socket.off("awareness", this._onAwareness);
    this.socket.off("connect", this._join);
    this.socket.off("disconnect", this._onDisconnect);
  }
}
