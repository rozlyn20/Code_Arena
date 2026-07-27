import { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import Sidebar from "./Sidebar";

export default function Dashboard({ apiBase, token, user, onLogout }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRooms() {
      try {
        const response = await fetch(`${apiBase}/api/chatrooms`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load chat rooms.");
        }

        setRooms(data.rooms);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadRooms();
  }, [apiBase, token]);

  function addRoom(room) {
    setRooms((previous) => {
      const alreadyExists = previous.some(
        (existingRoom) => existingRoom.roomId === room.roomId,
      );

      return alreadyExists ? previous : [room, ...previous];
    });

    setActiveRoom(room);
  }

  function handleLogout() {
    localStorage.removeItem("codearena_chat_token");
    localStorage.removeItem("codearena_chat_user");
    onLogout();
  }

  return (
    <main>
      <Sidebar
        rooms={rooms}
        activeRoomId={activeRoom?.roomId}
        onSelectRoom={setActiveRoom}
        onLogout={handleLogout}
      />

      <section>
        <h1>Project Discussions</h1>
        <p>Signed in as {user.username}</p>

        <CreateRoom apiBase={apiBase} token={token} onRoomCreated={addRoom} />
        <JoinRoom apiBase={apiBase} token={token} onRoomJoined={addRoom} />

        {error && <p>{error}</p>}

        {activeRoom ? (
          <ChatRoom
            key={activeRoom.roomId}
            apiBase={apiBase}
            token={token}
            user={user}
            room={activeRoom}
          />
        ) : (
          <p>Create or join a discussion room to begin.</p>
        )}
      </section>
    </main>
  );
}