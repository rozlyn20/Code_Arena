import Avatar from "react-avatar";
import { Crown, Circle } from "lucide-react";

export default function Client({ username, isHost = false }) {
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition-all duration-300 hover:border-violet-500/40 hover:bg-zinc-800/80">

      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar name={username} size="48" round="14px" />

          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-zinc-900 bg-emerald-500"></span>
        </div>

        <div>
          <h3 className="font-semibold text-white">{username}</h3>

          <p className="text-xs text-zinc-400">
            {isHost ? "Room Host" : "Participant"}
          </p>
        </div>
      </div>

      {isHost && (
        <Crown size={18} className="text-yellow-400" />
      )}
    </div>
  );
}