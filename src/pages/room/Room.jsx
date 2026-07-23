import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import "./Room.css";
import Client from "../../components/Client";
import Editor from "../../components/Editor";

export default function Room() {
  const [clients, setClients] = useState([
    { socketId: 1, username: "Rose" },
    { socketId: 2, username: "Rosh" },
  ]);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState("cpp");

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied!");
    } catch (err) {
      toast.error("Failed to copy Room ID.");
    }
  };

  const leaveRoom = () => {
    toast.success("Left the room");
    navigate("/rooms");
  };

  return (
    <div className="room-page">
      {/* Top Navbar */}
      <header className="room-navbar">
        <div className="logo">
          <h2>CodeArena</h2>
        </div>

        <div className="room-info">
          <span className="room-id">
            Room: <strong>{roomId}</strong>
          </span>

          <button onClick={copyRoomId} className="copy-btn">
            Copy ID
          </button>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>

          <button className="run-btn">▶ Run</button>

          <button onClick={leaveRoom} className="leave-btn">
            Leave
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="room-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Participants</h3>

          <div className="participant">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
          
          </div>

          <div className="participant">Waiting for others...</div>
        </aside>

        {/* Editor */}
        <main className="editor-container">
          <div className="editor-placeholder">
            <Editor/>
          </div>
        </main>
      </div>
    </div>
  );
}
