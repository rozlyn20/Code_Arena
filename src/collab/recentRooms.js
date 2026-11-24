const KEY = "codearena_recent_rooms";
const MAX_ROOMS = 8;

// Rooms this browser has opened lately: [{ roomId, username, lastOpened }]
export function getRecentRooms() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Call whenever you enter a room. Moves it to the top of the list.
export function rememberRoom(roomId, username) {
  try {
    const rest = getRecentRooms().filter((room) => room.roomId !== roomId);
    const next = [{ roomId, username, lastOpened: Date.now() }, ...rest].slice(0, MAX_ROOMS);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (e.g. private mode): the list just won't persist.
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