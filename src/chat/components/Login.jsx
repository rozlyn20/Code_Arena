import { useState } from "react";

export default function Login({ apiBase, onAuthenticated, onShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("codearena_chat_token", data.token);
      localStorage.setItem("codearena_chat_user", JSON.stringify(data.user));
      onAuthenticated(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        required
        type="email"
        value={email}
        placeholder="Email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        required
        type="password"
        value={password}
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
      />
      {error && <p>{error}</p>}
      <button disabled={loading} type="submit">
        {loading ? "Logging in..." : "Login"}
      </button>
      <button type="button" onClick={onShowSignup}>
        Create an account
      </button>
    </form>
  );
}