import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <input
        required
        value={roomId}
        placeholder="Paste Room ID"
        onChange={(event) => setRoomId(event.target.value)}
      />
      <button type="submit">Join room</button>
      {error && <p>{error}</p>}
    </form>
  );
}