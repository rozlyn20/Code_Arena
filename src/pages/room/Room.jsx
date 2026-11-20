import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "./room.css";
import Client from "../../components/Client";
import Editor from "../../components/Editor";
import { useCollabRoom } from "../../collab/useCollabRoom";
import { useYMapValue } from "../../collab/useYMapValue";

export default function Room() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const { username } = location.state || {};

  // Two Yjs documents per room:
  //   main   -> shared, everyone edits it live (like a Google Doc)
  //   branch -> private to me; syncs only across my own tabs/devices
  const { collab, connected, synced, peers, error } = useCollabRoom({ roomId, username });
  const [tab, setTab] = useState("main");
  const active = collab ? collab[tab] : null;

  // Language, stdin and the last run's output live inside the active document,
  // so on Main everyone sees the same run result.
  const [language, setLanguage] = useYMapValue(active?.meta, "language", "cpp");
  const [input, setInput] = useYMapValue(active?.meta, "input", "");
  const [execution, setExecution] = useYMapValue(active?.meta, "lastRun", null);

  const [isRunning, setIsRunning] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(null);

  useEffect(() => {
    if (!username) {
      toast.error("Please enter your display name.");
      navigate("/roomhub");
    }
  }, [username, navigate]);

  useEffect(() => {
    if (error) toast.error(`Live sync: ${error}`);
  }, [error]);

  const runCode = async () => {
    if (!active) return;
    setIsRunning(true);

    try {
      const apiBase = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

      const response = await fetch(`${apiBase}/api/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: active.text.toString(),
          language,
          input,
        }),
      });

      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        setExecution({
          status: "rate_limited",
          stdout: "",
          stderr:
            data.message ||
            "You're running code too frequently. Wait a few seconds and try again.",
          by: username,
        });
        return;
      }

      const remaining = response.headers.get("X-RateLimit-Remaining");
      if (remaining !== null && Number(remaining) === 0) {
        setCooldownUntil(Date.now() + 10_000); // matches refillInterval
      }

      const data = await response.json();
      setExecution({ ...data, by: username });
    } catch (error) {
      setExecution({
        status: "request_error",
        stdout: "",
        stderr: "Could not reach the execution server.",
        by: username,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const executionText = () => {
    if (!execution) {
      return '> Click "Run" to execute your code...';
    }

    const header = `[${execution.status.toUpperCase()}]${
      execution.by ? `  ·  run by ${execution.by}` : ""
    }`;
    const sections = [header];

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
    navigate("/roomhub"); // the hook's cleanup closes the connection
  };

  const statusLabel = error
    ? "Connection problem"
    : !connected
      ? "Offline · edits saved on this device"
      : !synced[tab]
        ? "Syncing…"
        : tab === "main"
          ? "Live"
          : "Private · synced";
  const statusClass = error || !connected ? "offline" : !synced[tab] ? "syncing" : "live";

  if (!username) return null;

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

          <span className={`status-pill ${statusClass}`}>{statusLabel}</span>

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
            onClick={runCode}
            disabled={
              !active || isRunning || (cooldownUntil && Date.now() < cooldownUntil)
            }
          >
            {isRunning ? "Running…" : "Run"}
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
            {peers.map((peer) => (
              <Client
                key={peer.userKey}
                username={peer.name}
                color={peer.color}
                isSelf={peer.isSelf}
              />
            ))}
          </div>

          {peers.length <= 1 && <div className="participant">Waiting for others...</div>}
        </aside>

        {/* Editor */}
        <main className="editor-container">
          <div className="editor-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "main"}
              className={`editor-tab ${tab === "main" ? "active" : ""}`}
              onClick={() => setTab("main")}
            >
              Main <span className="tab-hint">shared · live</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "branch"}
              className={`editor-tab ${tab === "branch" ? "active" : ""}`}
              onClick={() => setTab("branch")}
            >
              My Branch <span className="tab-hint">private</span>
            </button>
          </div>

          <div className="editor-wrapper">
            {active && (
              <Editor
                key={tab}
                ytext={active.text}
                awareness={active.awareness}
                language={language}
              />
            )}
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
