import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Hash, Radio, SendHorizontal } from "lucide-react";
import ChatMessage from "./ChatMessage";

export default function ChatRoom({ apiBase, token, user, room }) {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = io(`${apiBase}/chat`, {
  auth: { token },
});
    socketRef.current = socket;

    socket.on("chat-history", ({ roomId, messages: history }) => {
      if (roomId === room.roomId) {
        setMessages(history);
      }
    });

    socket.on("receive-message", ({ message }) => {
      if (message.roomId === room.roomId) {
        setMessages((previous) => [...previous, message]);
      }
    });

    socket.emit("join-chat-room", { roomId: room.roomId }, (result) => {
      if (!result?.ok) {
        setError(result?.message || "Unable to join chat room.");
      }
    });

    return () => {
      socket.emit("leave-chat-room", { roomId: room.roomId });
      socket.disconnect();
    };
  }, [apiBase, token, room.roomId]);

  function sendMessage(event) {
    event.preventDefault();

    if (!text.trim() || !socketRef.current) {
      return;
    }

    socketRef.current.emit(
      "send-message",
      { roomId: room.roomId, text },
      (result) => {
        if (!result?.ok) {
          setError(result?.message || "Message could not be sent.");
        }
      },
    );

    setText("");
  }

  return (
    <section className="flex min-h-[580px] flex-col bg-zinc-950/30">
      <header className="flex flex-col gap-4 border-b border-white/10 bg-zinc-900/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-400/20 bg-gradient-to-br from-brand-blue/20 to-brand-violet/20">
              <Hash size={15} className="text-indigo-200" />
            </div>

            <h2 className="truncate text-base font-semibold tracking-tight text-white sm:text-lg">
              {room.roomName}
            </h2>
          </div>

          <div className="mt-2 flex items-center gap-2 pl-10">
            <span className="font-mono text-[11px] text-zinc-500">
              Room ID: {room.roomId}
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <Radio size={11} className="animate-pulse" />
              Live
            </span>
          </div>
        </div>

        <div className="w-fit rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-medium text-zinc-400">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </div>
      </header>

      {error && (
        <div className="mx-5 mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 sm:mx-6">
          {error}
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <ChatMessage
              key={message._id}
              message={message}
              currentUserId={user.id}
            />
          ))
        ) : (
          <div className="flex min-h-[290px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/15 bg-gradient-to-br from-brand-blue/10 to-brand-violet/10">
              <Hash size={20} className="text-indigo-300" />
            </div>

            <p className="text-sm font-semibold text-white">
              Start the conversation
            </p>

            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-zinc-500">
              Share ideas, plan your next feature, or discuss a technical challenge
              with your team.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 bg-zinc-950/40 p-4 sm:p-5">
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-2 pl-4 shadow-xl shadow-black/20 transition-colors duration-200 focus-within:border-indigo-400/40 focus-within:ring-4 focus-within:ring-indigo-500/10"
        >
          <input
            value={text}
            placeholder="Write a message..."
            onChange={(event) => setText(event.target.value)}
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-zinc-600"
          />

          <button
            type="submit"
            aria-label="Send message"
            className="group flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet px-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:brightness-110 hover:shadow-indigo-500/35 active:scale-95 sm:px-4"
          >
            <span className="hidden sm:inline">Send</span>
            <SendHorizontal
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </form>

        <p className="mt-2 px-1 text-[10px] text-zinc-600">
          Messages are saved securely in this discussion room.
        </p>
      </div>
    </section>
  );
}