// Single source of truth for Yjs document names, shared by the socket server
// and the account-claim logic so they can never drift apart.

function docName(roomId, kind, userId) {
  const safeRoom = encodeURIComponent(roomId); // keeps ":" out of ids so names can't collide
  return kind === "main"
    ? `${safeRoom}:main`
    : `${safeRoom}:branch:${encodeURIComponent(userId)}`;
}

// Every private branch that belongs to one guest ends with this suffix.
function guestBranchSuffix(guestId) {
  return `:branch:${encodeURIComponent(`guest:${guestId}`)}`;
}

module.exports = { docName, guestBranchSuffix };