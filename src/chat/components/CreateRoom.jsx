import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";

export default function CreateRoom({ apiBase, token, onRoomCreated }) {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/chatrooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create room.");
      }

      setRoomName("");
      onRoomCreated(data.room);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/70 px-3.5 py-1.5 transition-all duration-200 focus-within:border-indigo-400/45 focus-within:ring-4 focus-within:ring-indigo-500/10">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-400/15 bg-gradient-to-br from-brand-blue/15 to-brand-violet/15 text-indigo-300">
          <Sparkles size={15} />
        </div>

        <input
          required
          value={roomName}
          placeholder="e.g. DSA Interview Prep"
          onChange={(event) => setRoomName(event.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-zinc-600"
        />

        <button
          type="submit"
          className="group/button inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet px-3.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:brightness-110 hover:shadow-indigo-500/35 active:scale-95"
        >
          <Plus
            size={15}
            className="transition-transform duration-200 group-hover/button:rotate-90"
          />
          <span className="hidden sm:inline">Create</span>
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