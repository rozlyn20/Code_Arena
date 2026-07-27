export default function ChatMessage({ message, currentUserId }) {
  const isOwnMessage = message.sender?._id === currentUserId || message.sender === currentUserId;
  const senderName = message.sender?.username || "Unknown user";

  return (
    <article>
      <strong>{isOwnMessage ? "You" : senderName}</strong>
      <time dateTime={message.createdAt}>
        {" "}
        {new Date(message.createdAt).toLocaleString()}
      </time>
      <p>{message.text}</p>
    </article>
  );
}