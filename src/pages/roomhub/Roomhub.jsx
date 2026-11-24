import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { getRecentRooms, timeAgo } from "../../collab/recentRooms";
import {
  isLoggedIn,
  getAccountUsername,
  loadRoomHistory,
  removeRoomFromHistory,
  migrateGuestDataToAccount,
} from "../../collab/roomHistory";

export default function RoomHub() {
  const navigate = useNavigate();

  const [loggedIn] = useState(() => isLoggedIn());
  const [displayName, setDisplayName] = useState(
    () => getAccountUsername() || getRecentRooms()[0]?.username || "",
  );
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isHost, setIsHost] = useState(false);
  // Logged in: starts empty and fills from the server. Guest: this browser's list.
  const [recentRooms, setRecentRooms] = useState(() =>
    isLoggedIn() ? [] : getRecentRooms(),
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // First visit after logging in on a browser used as a guest: move that
      // guest's rooms and private branches into the account.
      const moved = await migrateGuestDataToAccount();
      if (!cancelled && moved && (moved.imported > 0 || moved.claimed > 0)) {
        toast.success("Your guest rooms were added to your account.");
      }

      const rooms = await loadRoomHistory();
      if (!cancelled) setRecentRooms(rooms);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

const createRoom = (e) => {
  e.preventDefault();

  if (!displayName.trim()) {
    toast.error("Please enter your display name.");
    return;
  }

  const id = uuidv4();
  setRoomCode(id);
  setIsHost(true);

  toast.success("New room created!");
};

 const joinRoom = () => {
  if (!displayName.trim() || !roomCode.trim()) {
    toast.error("Please enter your display name and room code.");
    return;
  }

navigate(`/room/${roomCode}`, {
  state: {
    username: displayName,
    isHost,
  },
});
};

  // One-click rejoin: uses the name typed above, or the name used last time.
  const rejoinRoom = (room) => {
    navigate(`/room/${room.roomId}`, {
      state: {
        username:
          displayName.trim() || room.username || getAccountUsername() || "Guest",
        isHost: false,
      },
    });
  };

  const removeRecent = async (roomId) => {
    setRecentRooms(await removeRoomFromHistory(roomId));
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8">
      <button
  onClick={() => navigate("/")}
  className="mb-6 text-sm text-zinc-400 transition-colors hover:text-white"
>
  ← Back to Home
</button>
        <h1 className="text-4xl font-bold text-white text-center">CodeArena</h1>

        <p className="text-zinc-400 text-center mt-2 mb-8">
          Collaborate. Code. Ace Interviews.
        </p>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-white/10 px-4 py-3 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Room ID"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-white/10 px-4 py-3 text-white outline-none"
          />

          <button
            onClick={joinRoom}
            className="w-full rounded-xl py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold"
          >
            Join Room
          </button>

          <p className="text-center text-zinc-400 text-sm">
            Don't have a room?{" "}
            <button
              onClick={createRoom}
              className="text-indigo-400 hover:text-violet-400 font-medium"
            >
              Create New Room
            </button>
          </p>
        </div>

        {(recentRooms.length > 0 || !loggedIn) && (
          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Recent rooms
            </h2>

            {recentRooms.length > 0 && (
              <ul className="space-y-2">
                {recentRooms.map((room) => (
                  <li
                    key={room.roomId}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-800/60 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white" title={room.roomId}>
                        {room.roomId}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {room.username ? `as ${room.username} · ` : ""}
                        {timeAgo(room.lastOpened)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => rejoinRoom(room)}
                      className="rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/30"
                    >
                      Rejoin
                    </button>

                    <button
                      type="button"
                      onClick={() => removeRecent(room.roomId)}
                      aria-label={`Remove ${room.roomId} from recent rooms`}
                      title="Remove from list"
                      className="text-zinc-500 transition-colors hover:text-red-400"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {loggedIn ? (
              <p className="mt-3 text-xs text-zinc-500">
                Synced to your account. Removing an entry does not delete the room's code.
              </p>
            ) : (
              <p className="mt-3 text-xs text-zinc-500">
                Saved in this browser only.{" "}
                <button
                  type="button"
                  onClick={() => navigate("/workspace")}
                  className="text-indigo-400 hover:text-violet-400"
                >
                  Log in
                </button>{" "}
                to keep your rooms and private code across devices.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}