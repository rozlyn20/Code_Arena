import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export default function RoomHub() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isHost, setIsHost] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8">
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
      </div>
    </div>
  );
}
