import {
  Hash,
  LogOut,
  MessageSquareText,
  Plus,
  TerminalSquare,
} from "lucide-react";

export default function Sidebar({
  rooms,
  activeRoomId,
  onSelectRoom,
  onLogout,
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-zinc-950/80 p-4 backdrop-blur-2xl lg:min-h-screen lg:w-[290px] lg:border-b-0 lg:border-r lg:p-5">
      <div className="mb-5 flex items-center justify-between lg:mb-9">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-gradient-to-br from-brand-blue/30 to-brand-violet/30 shadow-lg shadow-indigo-500/10">
            <TerminalSquare size={19} className="text-white" />
          </div>

          <div>
            <p className="text-sm font-bold tracking-tight text-white">
              CodeArena
            </p>
            <p className="text-[11px] font-medium text-zinc-500">
              Developer Workspace
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          title="Logout"
          className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-500 transition-all duration-200 hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300 active:scale-95"
        >
          <LogOut size={16} />
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          Discussion rooms
        </h3>

        <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
          {rooms.length}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
        {rooms.map((room) => {
          const isActive = room.roomId === activeRoomId;

          return (
            <button
              key={room.roomId}
              type="button"
              onClick={() => onSelectRoom(room)}
              aria-pressed={isActive}
              className={`group relative min-w-[190px] overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 active:scale-[0.98] lg:min-w-0 ${
                isActive
                  ? "border-indigo-400/30 bg-gradient-to-r from-brand-blue/15 to-brand-violet/15 shadow-lg shadow-indigo-950/20"
                  : "border-transparent bg-white/[0.025] hover:border-white/10 hover:bg-white/[0.055]"
              }`}
            >
              {isActive && (
                <span className="absolute inset-y-3 left-0 w-0.5 rounded-r-full bg-gradient-to-b from-brand-blue to-brand-violet" />
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    isActive
                      ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-200"
                      : "border-white/10 bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                  }`}
                >
                  {isActive ? <MessageSquareText size={16} /> : <Hash size={16} />}
                </div>

                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-semibold ${
                      isActive
                        ? "text-white"
                        : "text-zinc-300 group-hover:text-white"
                    }`}
                  >
                    {room.roomName}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                    {isActive ? "Active discussion" : `Room · ${room.roomId}`}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {rooms.length === 0 && (
          <div className="flex min-w-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-7 text-center lg:min-w-0">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-zinc-500">
              <Plus size={15} />
            </div>
            <p className="text-xs font-medium text-zinc-400">No rooms yet</p>
            <p className="mt-1 text-[11px] text-zinc-600">
              Create or join one above.
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 hidden rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-transparent p-4 lg:block">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
          <span className="text-[11px] font-semibold text-zinc-300">
            Workspace online
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-zinc-500">
          Persistent team discussions for your coding sessions.
        </p>
      </div>
    </aside>
  );
}