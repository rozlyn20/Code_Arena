import { useState } from "react";
import { ArrowRight, Hash } from "lucide-react";

export default function JoinRoom({ apiBase, token, onRoomJoined }) {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/chatrooms/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to join room.");
      }

      setRoomId("");
      onRoomJoined(data.room);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/70 px-3.5 py-1.5 transition-all duration-200 focus-within:border-violet-400/45 focus-within:ring-4 focus-within:ring-violet-500/10">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-gradient-to-br from-brand-blue/15 to-brand-violet/15 text-violet-300">
          <Hash size={15} />
        </div>

        <input
          required
          value={roomId}
          placeholder="Paste a shared Room ID"
          onChange={(event) => setRoomId(event.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 font-mono text-sm text-white outline-none placeholder:font-sans placeholder:text-zinc-600"
        />

        <button
          type="submit"
          className="group/button inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-violet-400/25 bg-white/[0.04] px-3.5 text-xs font-semibold text-zinc-100 transition-all duration-200 hover:border-violet-400/45 hover:bg-gradient-to-r hover:from-brand-blue/20 hover:to-brand-violet/20 hover:text-white active:scale-95"
        >
          <span className="hidden sm:inline">Join</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover/button:translate-x-0.5"
          />
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {error}
        </p>
      )}
    </form>
  );
}