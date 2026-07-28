import { useEffect, useState } from "react";
import { MessageSquareText, Sparkles } from "lucide-react";
import ChatRoom from "./ChatRoom";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import Sidebar from "./Sidebar";

export default function Dashboard({ apiBase, token, user, onLogout }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRooms() {
      try {
        const response = await fetch(`${apiBase}/api/chatrooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load chat rooms.");
        }

        setRooms(data.rooms);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadRooms();
  }, [apiBase, token]);

  function addRoom(room) {
    setRooms((previous) => {
      const alreadyExists = previous.some(
        (existingRoom) => existingRoom.roomId === room.roomId,
      );

      return alreadyExists ? previous : [room, ...previous];
    });

    setActiveRoom(room);
  }

  function handleLogout() {
    localStorage.removeItem("codearena_chat_token");
    localStorage.removeItem("codearena_chat_user");
    onLogout();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-36 h-96 w-96 rounded-full bg-brand-blue/10 blur-[130px]" />
        <div className="absolute -right-28 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-violet/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar
          rooms={rooms}
          activeRoomId={activeRoom?.roomId}
          onSelectRoom={setActiveRoom}
          onLogout={handleLogout}
        />

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
          <header className="mb-7 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
                <Sparkles size={14} className="text-brand-violet" />
                Team workspace
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Project Discussions
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Collaborate, plan, and keep technical conversations in one place.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/60 px-3.5 py-2 text-sm text-zinc-300 shadow-lg shadow-black/20 backdrop-blur-xl">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue/30 to-brand-violet/30 text-xs font-bold text-white">
                {user.username?.slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-36 truncate">{user.username}</span>
            </div>
          </header>

          <div className="mb-7 grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-indigo-400/25">
              <div className="mb-4">
                <p className="text-sm font-semibold text-white">Start a discussion</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  Create a focused space for your team, project, or interview preparation.
                </p>
              </div>

              <CreateRoom
                apiBase={apiBase}
                token={token}
                onRoomCreated={addRoom}
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-violet-400/25">
              <div className="mb-4">
                <p className="text-sm font-semibold text-white">Join with Room ID</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  Continue a conversation shared by your teammates or mentors.
                </p>
              </div>

              <JoinRoom
                apiBase={apiBase}
                token={token}
                onRoomJoined={addRoom}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {activeRoom ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <ChatRoom
                key={activeRoom.roomId}
                apiBase={apiBase}
                token={token}
                user={user}
                room={activeRoom}
              />
            </div>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/30 px-6 text-center backdrop-blur-xl">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-brand-blue/20 to-brand-violet/20 shadow-lg shadow-indigo-500/10">
                <MessageSquareText className="text-indigo-300" size={25} />
              </div>

              <h2 className="text-lg font-semibold text-white">
                Select a discussion room
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
                Create a new room or join an existing one to view your team’s
                previous conversations.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}