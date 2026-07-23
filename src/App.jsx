import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Welcome from "./pages/Welcome";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import RoomHub from "./pages/roomhub/Roomhub";
import Room from "./pages/room/Room";

function App() {
  return (
   <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/roomhub" element={<RoomHub />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>

  );
}

export default App;