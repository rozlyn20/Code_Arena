import { useState } from "react";
import {
  ArrowRight,
  AtSign,
  Code2,
  LockKeyhole,
  UserRound,
} from "lucide-react";

export default function Signup({ apiBase, onAuthenticated, onShowLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10 text-white">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-violet/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-brand-blue/15 blur-[150px]" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8"
      >
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-brand-blue/30 to-brand-violet/30 shadow-lg shadow-violet-500/15">
            <Code2 size={22} className="text-white" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            CodeArena Workspace
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
            Build with your team
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Create your account and start focused technical discussions.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-zinc-400">
              Display name
            </span>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/70 px-3.5 transition-all duration-200 focus-within:border-violet-400/45 focus-within:ring-4 focus-within:ring-violet-500/10">
              <UserRound size={16} className="shrink-0 text-zinc-500" />
              <input
                required
                value={username}
                placeholder="Your name"
                onChange={(event) => setUsername(event.target.value)}
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-zinc-400">
              Email address
            </span>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/70 px-3.5 transition-all duration-200 focus-within:border-violet-400/45 focus-within:ring-4 focus-within:ring-violet-500/10">
              <AtSign size={16} className="shrink-0 text-zinc-500" />
              <input
                required
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-zinc-400">
              Password
            </span>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/70 px-3.5 transition-all duration-200 focus-within:border-violet-400/45 focus-within:ring-4 focus-within:ring-violet-500/10">
              <LockKeyhole size={16} className="shrink-0 text-zinc-500" />
              <input
                required
                minLength="6"
                type="password"
                value={password}
                placeholder="At least 6 characters"
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          type="submit"
          className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
        >
          {loading ? "Creating account..." : "Create workspace account"}
          {!loading && (
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          )}
        </button>

        <div className="mt-6 border-t border-white/[0.08] pt-5 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onShowLogin}
              className="font-semibold text-violet-300 transition-colors hover:text-white"
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}