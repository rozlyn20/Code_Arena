import { v4 as uuidv4 } from "uuid";

const GUEST_KEY = "codearena_guest_id";
const PUBLIC_KEY = "codearena_public_id";
const TOKEN_KEY = "codearena_chat_token";
const USER_KEY = "codearena_chat_user";

const PALETTE = [
  "#f87171", "#fb923c", "#fbbf24", "#a3e635", "#34d399",
  "#22d3ee", "#60a5fa", "#a78bfa", "#f472b6",
];

function readOrCreate(key) {
  try {
    let value = localStorage.getItem(key);
    if (!value) {
      value = uuidv4();
      localStorage.setItem(key, value);
    }
    return value;
  } catch {
    return uuidv4(); // storage blocked: works for this page load only
  }
}

// A JWT is "header.payload.signature". Read the expiry from the payload so we
// don't treat a stale token as a login (the server makes the same decision).
function tokenIsFresh(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload));
    return !exp || exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getValidToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return token && tokenIsFresh(token) ? token : null;
  } catch {
    return null;
  }
}

export function getAccountUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

// Called after a guest's data has moved into an account: this browser starts
// over with a brand-new guest identity (and therefore empty guest branches).
export function rotateGuestId() {
  try {
    localStorage.setItem(GUEST_KEY, uuidv4());
  } catch {
    // ignore
  }
}

// Who am I?
//  - guestId   SECRET. Proves ownership of this browser's private branches. Only ever
//              sent to our own server, never put in presence data other people can see.
//  - userKey   private id, used only for local (IndexedDB) storage names.
//  - publicKey safe to broadcast to other participants (presence list, cursor colors).
export function getIdentity() {
  const guestId = readOrCreate(GUEST_KEY);
  const publicId = readOrCreate(PUBLIC_KEY);

  const token = getValidToken();
  const user = token ? getAccountUser() : null;
  const loggedIn = Boolean(token && user?.id);

  return {
    guestId,
    token: loggedIn ? token : null,
    userKey: loggedIn ? String(user.id) : `guest:${guestId}`,
    publicKey: loggedIn ? String(user.id) : `g-${publicId}`,
  };
}

// Stable color per person so their cursor looks the same on every screen.
export function colorFor(key) {
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const color = PALETTE[hash % PALETTE.length];
  return { color, colorLight: `${color}33` };
}