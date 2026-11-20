import { v4 as uuidv4 } from "uuid";

const GUEST_KEY = "codearena_guest_id";
const PALETTE = [
  "#f87171", "#fb923c", "#fbbf24", "#a3e635", "#34d399",
  "#22d3ee", "#60a5fa", "#a78bfa", "#f472b6",
];

// Who am I? A logged-in user (JWT from the workspace login) or an anonymous guest
// with a random id that stays the same in this browser, so my private branch
// is still mine after a refresh.
export function getIdentity() {
  let guestId = null;
  let token = null;
  let user = null;

  try {
    guestId = localStorage.getItem(GUEST_KEY);
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem(GUEST_KEY, guestId);
    }
    token = localStorage.getItem("codearena_chat_token");
    user = JSON.parse(localStorage.getItem("codearena_chat_user") || "null");
  } catch {
    guestId = guestId || uuidv4();
  }

  const userKey = token && user?.id ? String(user.id) : `guest:${guestId}`;
  return { guestId, token, userKey };
}

// Stable color per person so their cursor looks the same on every screen.
export function colorFor(key) {
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const color = PALETTE[hash % PALETTE.length];
  return { color, colorLight: `${color}33` };
}
