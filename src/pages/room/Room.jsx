import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "./room.css";
import Client from "../../components/Client";
import Editor from "../../components/Editor";
import { initSocket } from "../../socket/socket";
import ACTIONS from "../../socket/actions";

export default function Room() {
  const socketRef = useRef(null);

  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const { username, isHost } = location.state || {};
  const [code, setCode] = useState("");
  const codeRef = useRef("");
  const [clients, setClients] = useState([]);
  const [language, setLanguage] = useState("cpp");
 const [input, setInput] = useState("");
const [execution, setExecution] = useState(null);
const [isRunning, setIsRunning] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    codeRef.current = newCode;
  };
  useEffect(() => {
    if (!username) {
      toast.error("Please enter your display name.");
      navigate("/roomhub");
      return;
    }

    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on(ACTIONS.JOINED, ({ clients, socketId }) => {
        setClients(clients);
        if (socketId !== socketRef.current.id) {
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            roomId,
            code: codeRef.current,
            targetSocketId: socketId,
          });
        }
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);

        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId),
        );
      });

      socketRef.current.on("connect", () => {
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username,
        });
      });
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        setCode(code);
        codeRef.current = code;
      });
      socketRef.current.on(ACTIONS.SYNC_CODE, ({ code }) => {
        console.log("CLIENT GOT SYNC", code);

        setCode(code);
        codeRef.current = code;
      });
      socketRef.current.on("hello-test", (data) => {
        console.log("HELLO TEST", data);
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
//  const runCode = async () => {
//   setIsRunning(true);

//   try {
//     const apiBase = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

//     const response = await fetch(`${apiBase}/api/run`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         code,
//         language,
//         input,
//       }),
//     });

//     const data = await response.json();
//     setExecution(data);
//   } catch (error) {
//     setExecution({
//       status: "request_error",
//       stdout: "",
//       stderr: "Could not reach the execution server.",
//     });
//   } finally {
//     setIsRunning(false);
//   }
// };
const runCode = async () => {
  setIsRunning(true);
  setExecution(null);

  try {
    const apiBase = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

    // 1. Queue the execution job
    const response = await fetch(`${apiBase}/api/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
        input,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setExecution(data);
      return;
    }

    const { jobId } = data;

    if (!jobId) {
      setExecution({
        status: "request_error",
        stdout: "",
        stderr: "No job ID was returned by the server.",
      });
      return;
    }

    // 2. Poll for the result
    const maxAttempts = 30;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const resultResponse = await fetch(
        `${apiBase}/api/run/${jobId}`
      );

      const resultData = await resultResponse.json();

      // Still waiting
      if (
        resultData.status === "waiting" ||
        resultData.status === "active" ||
        resultData.status === "delayed" ||
        resultData.status === "waiting-children"
      ) {
        continue;
      }

      // Job finished
      if (resultData.status === "completed") {
        setExecution(resultData.result);
        return;
      }

      // Job failed
      if (resultData.status === "failed") {
        setExecution(
          resultData.result || {
            status: "failed",
            stdout: "",
            stderr: "Code execution failed.",
          }
        );
        return;
      }
    }

    // 3. Timeout while waiting for worker
    setExecution({
      status: "timeout",
      stdout: "",
      stderr: "Execution took too long to complete.",
    });
  } catch (error) {
    console.error("Code execution request failed:", error);

    setExecution({
      status: "request_error",
      stdout: "",
      stderr: "Could not reach the execution server.",
    });
  } finally {
    setIsRunning(false);
  }
};

const executionText = () => {
  if (!execution) {
    return '> Click "Run" to execute your code...';
  }

  const sections = [`[${execution.status.toUpperCase()}]`];

  if (execution.stdout) {
    sections.push(`STDOUT\n${execution.stdout}`);
  }

  if (execution.stderr) {
    sections.push(`STDERR\n${execution.stderr}`);
  }

  if (!execution.stdout && !execution.stderr) {
    sections.push("(No output)");
  }

  return sections.join("\n\n");
};
  const syncCode = () => {
    setSyncing(true);

    socketRef.current.emit(ACTIONS.SYNC_CODE, {
      roomId,
      code: codeRef.current,
    });

    setTimeout(() => {
      setSyncing(false);
    }, 600);

    toast.success("Sync button clicked!");
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
    socketRef.current?.disconnect();
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

          <button
  type="button"
  className="run-btn"
  onClick={runCode}
  disabled={isRunning}
>
  {isRunning ? "Running…" : "▶ Run"}
</button>
          <button
            onClick={syncCode}
            className={`sync-btn ${syncing ? "syncing" : ""}`}
          >
            {syncing ? "✅ Synced!" : "🔄 Sync Editor"}
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
              onCodeChange={handleCodeChange}
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
      onClick={() => setExecution(null)}
      type="button"
    >
      Clear
    </button>
  </div>

  <label className="stdin-label" htmlFor="custom-input">
    Custom input (stdin)

    <textarea
      id="custom-input"
      className="stdin-input"
      value={input}
      onChange={(event) => setInput(event.target.value)}
      placeholder={"Example:\n5\n10 20 30 40 50"}
      spellCheck="false"
    />
  </label>

  <pre className="terminal-output">{executionText()}</pre>
</div>
        </main>
      </div>
    </div>
  );
}
