const crypto = require("crypto");
const redis = require("../config/redis");

const OTP_EXPIRY = 5 * 60; // 5 minutes

function hashOTP(otp) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

async function saveOTP(email, otp) {
  const hashedOTP = hashOTP(otp);

  await redis.set(
    `otp:${email}`,
    hashedOTP,
    {
      ex: OTP_EXPIRY,
    }
  );
}

async function verifyOTP(email, otp) {
  const storedOTP = await redis.get(`otp:${email}`);

  if (!storedOTP) {
    return false;
  }

  const hashedOTP = hashOTP(otp);

  if (hashedOTP !== storedOTP) {
    return false;
  }

  await redis.del(`otp:${email}`);

  return true;
}

module.exports = {
  saveOTP,
  verifyOTP,
};