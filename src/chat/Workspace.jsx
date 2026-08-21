import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

const API_BASE =  import.meta.env.VITE_BACKEND_URL;

export default function Workspace() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(
    localStorage.getItem("codearena_chat_token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("codearena_chat_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showSignup, setShowSignup] = useState(
  searchParams.get("mode") === "signup"
);
useEffect(() => {
  setShowSignup(searchParams.get("mode") === "signup");
}, [searchParams]);

  function handleAuthenticated(data) {
    setToken(data.token);
    setUser(data.user);
  }

  function handleLogout() {
    localStorage.removeItem("codearena_chat_token");
    localStorage.removeItem("codearena_chat_user");

    setToken(null);
    setUser(null);
    setShowSignup(false);
  }

  if (!token || !user) {
    return showSignup ? (
      <Signup
        apiBase={API_BASE}
        onAuthenticated={handleAuthenticated}
        onShowLogin={() => setShowSignup(false)}
      />
    ) : (
      <Login
        apiBase={API_BASE}
        onAuthenticated={handleAuthenticated}
        onShowSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <Dashboard
      apiBase={API_BASE}
      token={token}
      user={user}
      onLogout={handleLogout}
    />
  );
}