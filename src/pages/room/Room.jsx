// import { useNavigate, useParams } from "react-router-dom";
// import { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";
// import "./Room.css";
// import Client from "../../components/Client";
// import Editor from "../../components/Editor";
// import { initSocket } from "../../socket/socket";
// import { useLocation } from "react-router-dom";
// import ACTIONS from "../../socket/actions";

// export default function Room() {
//   const socketRef = useRef(null);
//   const location = useLocation();

// const { username, isHost } = location.state || {};

//   useEffect(() => {
//     const init = async () => {
//       socketRef.current = await initSocket();
//       socketRef.current.emit(ACTIONS.JOIN,{
//         roomId,
//         username:
//       });

//     };
//     init();
//   }, []);
//   const [clients, setClients] = useState([
//     { socketId: 1, username: "Rose" },
//     { socketId: 2, username: "Rosh" },
//   ]);
//   const { roomId } = useParams();
//   const navigate = useNavigate();

//   const [language, setLanguage] = useState("cpp");

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success("Room ID copied!");
//     } catch (err) {
//       toast.error("Failed to copy Room ID.");
//     }
//   };

//   const leaveRoom = () => {
//     toast.success("Left the room");
//     navigate("/rooms");
//   };

//   return (
//     <div className="room-page">
//       {/* Top Navbar */}
//       <header className="room-navbar">
//         <div className="logo">
//           <h2>CodeArena</h2>
//         </div>

//         <div className="room-info">
//           <span className="room-id">
//             Room: <strong>{roomId}</strong>
//           </span>

//           <button onClick={copyRoomId} className="copy-btn">
//             Copy ID
//           </button>

//           <select
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="language-select"
//           >
//             <option value="cpp">C++</option>
//             <option value="java">Java</option>
//             <option value="python">Python</option>
//             <option value="javascript">JavaScript</option>
//           </select>

//           <button className="run-btn">▶ Run</button>

//           <button onClick={leaveRoom} className="leave-btn">
//             Leave
//           </button>
//         </div>
//       </header>

//       {/* Main Layout */}
//       <div className="room-content">
//         {/* Sidebar */}
//         <aside className="sidebar">
//           <h3>Participants</h3>

//           <div className="clients-list">
//             {clients.map((client) => (
//               <Client key={client.socketId} username={client.username} />
//             ))}
//           </div>

//           <div className="participant">Waiting for others...</div>
//         </aside>

//         {/* Editor */}
//         <main className="editor-container">
//           <div className="editor-wrapper">
//             <Editor />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "./Room.css";
import Client from "../../components/Client";
import Editor from "../../components/Editor";
import { initSocket } from "../../socket/socket";
import ACTIONS from "../../socket/actions";

export default function Room() {
  const socketRef = useRef(null);

  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const [code, setCode] = useState("");

  const { username, isHost } = location.state || {};

  const [clients, setClients] = useState([]);

  const [language, setLanguage] = useState("cpp");
const [output, setOutput] = useState("");

  useEffect(() => {
    if (!username) {
      toast.error("Please enter your display name.");
      navigate("/rooms");
      return;
    }

    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username }) => {
        console.log("JOINED EVENT:", clients);

        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
        }

        setClients(clients);
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);

        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId),
        );
      });

      socketRef.current.on("connect", () => {
        console.log("Connected:", socketRef.current.id);

        console.log("Emitting JOIN", { roomId, username });

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username,
        });
      });
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        setCode(code);
      });

      socketRef.current.on("connect_error", (err) => {
        toast.error("Socket connection failed");
        console.error(err);
      });
    };
    init();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, username, navigate]);
  const runCode = async () => {
    console.log("API HIT");

    try {
      const response = await fetch("http://localhost:5000/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      console.log("Response received:", response);

      const data = await response.json();
      setOutput(data.output || data.error);
      console.log("Data:", data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
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
    navigate("/roomhub");
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

          <button type="button" className="run-btn" onClick={runCode}>
            ▶ Run
          </button>

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

          <div className="clients-list">
            {clients.map((client) => (
              <Client
                key={client.socketId}
                username={client.username}
                isHost={client.isHost}
              />
            ))}
          </div>

          <div className="participant">Waiting for others...</div>
        </aside>

        {/* Editor */}
        <main className="editor-container">
          <div className="editor-wrapper">
            <Editor
              socketRef={socketRef}
              roomId={roomId}
              code={code}
              onCodeChange={setCode}
            />
          </div>
         <div className="output-panel">
  <div className="output-header">
    <div className="terminal-title">
      <span className="terminal-dot"></span>
      <h3>Output</h3>
    </div>

    <button
      className="clear-output"
      onClick={() => setOutput("")}
    >
      Clear
    </button>
  </div>

  <pre className="terminal-output">
    {output || '> Click "Run" to execute your code...'}
  </pre>
</div>
        </main>
      </div>
    </div>
  );
}
