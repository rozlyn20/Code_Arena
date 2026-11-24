const KEY = "codearena_recent_rooms";
const ACTIVITY_KEY = "codearena_guest_active";
const MAX_ROOMS = 8;

// GUEST history lives here, in this browser. Logged-in users use the server
// (see roomHistory.js). Entries look like { roomId, username, lastOpened }.
export function getRecentRooms() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Call whenever a guest enters a room. Moves it to the top of the list.
export function rememberRoom(roomId, username) {
  try {
    const rest = getRecentRooms().filter((room) => room.roomId !== roomId);
    const next = [{ roomId, username, lastOpened: Date.now() }, ...rest].slice(0, MAX_ROOMS);
    localStorage.setItem(KEY, JSON.stringify(next));
    // Remember that this guest identity owns data worth moving into an account.
    localStorage.setItem(ACTIVITY_KEY, "1");
  } catch {
    // Storage unavailable (e.g. private mode): the list just won't persist.
  }
}

// True if this browser has been used as a guest since the last migration.
export function hasGuestActivity() {
  try {
    return localStorage.getItem(ACTIVITY_KEY) === "1";
  } catch {
    return false;
  }
}

// Removes an entry from the list only. The room's saved code is NOT deleted.
export function forgetRoom(roomId) {
  const next = getRecentRooms().filter((room) => room.roomId !== roomId);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function clearRecentRooms() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(ACTIVITY_KEY);
  } catch {
    // ignore
  }
}

export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}