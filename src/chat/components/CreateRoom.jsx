import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <input
        required
        value={roomName}
        placeholder="New discussion room name"
        onChange={(event) => setRoomName(event.target.value)}
      />
      <button type="submit">Create room</button>
      {error && <p>{error}</p>}
    </form>
  );
}