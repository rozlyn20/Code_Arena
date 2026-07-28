export default function ChatMessage({ message, currentUserId }) {
  const isOwnMessage =
    message.sender?._id === currentUserId || message.sender === currentUserId;

  const senderName = message.sender?.username || "Unknown user";
  const initials = senderName.slice(0, 1).toUpperCase();

  return (
    <article
      className={`flex w-full gap-3 ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
          isOwnMessage
            ? "border-indigo-400/30 bg-gradient-to-br from-brand-blue/30 to-brand-violet/30 text-white"
            : "border-white/10 bg-zinc-800 text-zinc-300"
        }`}
      >
        {isOwnMessage ? "Y" : initials}
      </div>

      <div
        className={`max-w-[80%] sm:max-w-[72%] ${
          isOwnMessage ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <div
          className={`mb-1 flex items-center gap-2 px-1 text-[11px] ${
            isOwnMessage ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <strong
            className={`font-semibold ${
              isOwnMessage ? "text-indigo-300" : "text-zinc-300"
            }`}
          >
            {isOwnMessage ? "You" : senderName}
          </strong>

          <time
            dateTime={message.createdAt}
            className="font-medium text-zinc-600"
          >
            {new Date(message.createdAt).toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
            isOwnMessage
              ? "rounded-tr-md border border-indigo-400/20 bg-gradient-to-br from-brand-blue/25 to-brand-violet/25 text-white shadow-indigo-950/30"
              : "rounded-tl-md border border-white/[0.09] bg-zinc-800/80 text-zinc-200 shadow-black/20"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
      </div>
    </article>
  );
}