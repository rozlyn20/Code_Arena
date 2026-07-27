import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatMessage from "./ChatMessage";

export default function ChatRoom({ apiBase, token, user, room }) {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = io(apiBase, {
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
    <section>
      <header>
        <h2>{room.roomName}</h2>
        <small>Room ID: {room.roomId}</small>
      </header>

      {error && <p>{error}</p>}

      <div>
        {messages.map((message) => (
          <ChatMessage
            key={message._id}
            message={message}
            currentUserId={user.id}
          />
        ))}
      </div>

      <form onSubmit={sendMessage}>
        <input
          value={text}
          placeholder="Write a message..."
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}