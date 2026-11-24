const express = require("express");
const requireAuth = require("../middleware/authMiddleware");
const {
  listRecent,
  removeRecent,
  importRooms,
  claimGuestData,
} = require("../controllers/roomHistoryController");

const router = express.Router();

router.use(requireAuth);

router.get("/recent", listRecent);
router.delete("/recent/:roomId", removeRecent);
router.post("/import", importRooms);
router.post("/claim-guest", claimGuestData);

module.exports = router;