const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmailOTP,
  resendOTP

} = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyEmailOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/logout", requireAuth, logout);


module.exports = router;