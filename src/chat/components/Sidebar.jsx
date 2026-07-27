export default function Sidebar({ rooms, activeRoomId, onSelectRoom, onLogout }) {
  return (
    <aside>
      <button type="button" onClick={onLogout}>
        Logout
      </button>

      <h3>Your discussion rooms</h3>

      {rooms.map((room) => (
        <button
          key={room.roomId}
          type="button"
          onClick={() => onSelectRoom(room)}
          aria-pressed={room.roomId === activeRoomId}
        >
          {room.roomName}
        </button>
      ))}
    </aside>
  );
}