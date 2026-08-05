import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Welcome from "./pages/Welcome";
import RoomHub from "./pages/roomhub/Roomhub";
import Room from "./pages/room/Room";

// Workspace
import Workspace from "./chat/Workspace";

function App() {
  return (
    <>
      <Toaster position="top-left" />

      <Routes>
        {/* Live Coding */}
        <Route path="/" element={<Welcome />} />
        <Route path="/roomhub" element={<RoomHub />} />
        <Route path="/room/:roomId" element={<Room />} />

        {/* Team Workspace */}
        <Route path="/workspace/*" element={<Workspace />} />
      </Routes>
    </>
  );
}

export default App;