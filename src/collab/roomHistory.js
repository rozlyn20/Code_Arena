import { getValidToken, getAccountUser, getIdentity, rotateGuestId } from "./identity";
import {
  getRecentRooms,
  forgetRoom as forgetLocalRoom,
  clearRecentRooms,
  hasGuestActivity,
} from "./recentRooms";

const API_BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

export const isLoggedIn = () => Boolean(getValidToken());
export const getAccountUsername = () => getAccountUser()?.username || "";

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}/api/rooms${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getValidToken()}`,
    },
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

// Logged in -> the account's history from the server. Guest -> this browser's list.
export async function loadRoomHistory() {
  if (!isLoggedIn()) return getRecentRooms();
  try {
    const { rooms } = await api("/recent");
    return rooms.map((room) => ({
      roomId: room.roomId,
      username: room.username,
      lastOpened: new Date(room.lastOpened).getTime(),
    }));
  } catch {
    return getRecentRooms(); // offline or session expired: show what this browser has
  }
}

// Removes the list entry only (never the room's saved code). Returns the new list.
export async function removeRoomFromHistory(roomId) {
  if (!isLoggedIn()) return forgetLocalRoom(roomId);
  try {
    await api(`/recent/${encodeURIComponent(roomId)}`, { method: "DELETE" });
  } catch {
    // fall through: the reload below shows the truth
  }
  return loadRoomHistory();
}

// When someone logs in on a browser they used as a guest, move that guest data
// into their account: the recent-rooms list AND their private branches.
// Safe to call repeatedly; it does nothing unless there is something to move.
let inFlight = null;

export function migrateGuestDataToAccount() {
  if (!isLoggedIn() || !hasGuestActivity()) return Promise.resolve(null);
  if (!inFlight) {
    inFlight = runMigration().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

async function runMigration() {
  const localRooms = getRecentRooms();
  const { guestId } = getIdentity();

  try {
    if (localRooms.length > 0) {
      await api("/import", { method: "POST", body: JSON.stringify({ rooms: localRooms }) });
    }
    const { claimed } = await api("/claim-guest", {
      method: "POST",
      body: JSON.stringify({ guestId }),
    });

    // Only after the server confirmed: this browser's guest data now belongs to
    // the account, so start a fresh guest identity.
    clearRecentRooms();
    rotateGuestId();
    return { imported: localRooms.length, claimed };
  } catch (error) {
    console.error("Guest data migration failed, will retry next visit:", error.message);
    return null;
  }
}