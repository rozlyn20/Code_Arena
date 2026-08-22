const bcrypt = require("bcryptjs");
const User = require("../models/User");
const createToken = require("../utils/createToken");
const redis = require("../config/redis");
const generateOTP = require("../utils/otp");
const { saveOTP,verifyOTP } = require("../services/otpService");
const transporter = require("../config/mail");

// async function register(req, res) {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({
//         message: "Username, email, and password are required.",
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         message: "Password must be at least 6 characters.",
//       });
//     }

//     const existingUser = await User.findOne({ email: email.toLowerCase() });

//     if (existingUser) {
//       return res.status(409).json({ message: "Email is already registered." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     const token = createToken(user._id.toString());

//     return res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Unable to create account." });
//   }
// }
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    // Hash password before temporarily storing registration data
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();

    // Store pending registration in Redis
    await redis.set(
      `registration:${normalizedEmail}`,
      JSON.stringify({
        username,
        email: normalizedEmail,
        password: hashedPassword,
      }),
      {
        ex: 10 * 60, // 10 minutes
      }
    );

    // Store OTP in Redis
    await saveOTP(normalizedEmail, otp);

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: normalizedEmail,
      subject: "CodeArena Email Verification",
      text: `Your CodeArena verification OTP is ${otp}. It is valid for 5 minutes.`,
    });

    return res.status(200).json({
      message: "OTP sent to your email. Please verify your email.",
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Unable to process registration.",
    });
  }
}
async function verifyEmailOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check whether OTP is valid
    const isValid = await verifyOTP(normalizedEmail, otp);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid or expired OTP.",
      });
    }

    // Get pending registration data
    const registrationData = await redis.get(
      `registration:${normalizedEmail}`
    );

    if (!registrationData) {
      return res.status(400).json({
        message: "Registration session has expired. Please register again.",
      });
    }

    const { username, email: userEmail, password } =
      typeof registrationData === "string"
        ? JSON.parse(registrationData)
        : registrationData;

    // Create user only after successful OTP verification
    const user = await User.create({
      username,
      email: userEmail,
      password,
    });

    // Remove temporary registration data
    await redis.del(`registration:${normalizedEmail}`);

    // Generate JWT
    const token = createToken(user._id.toString());

    return res.status(201).json({
      message: "Email verified and account created successfully.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      message: "Unable to verify email.",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user._id.toString());

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in." });
  }
}
async function resendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if registration is still pending
    const registrationData = await redis.get(
      `registration:${normalizedEmail}`
    );

    if (!registrationData) {
      return res.status(400).json({
        message: "Registration session has expired. Please register again.",
      });
    }

    // Generate a new OTP
    const otp = generateOTP();

    // Save new OTP and reset its 5-minute expiry
    await saveOTP(normalizedEmail, otp);

    // Send new OTP
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: normalizedEmail,
      subject: "CodeArena Email Verification",
      text: `Your new CodeArena verification OTP is ${otp}. It is valid for 5 minutes.`,
    });

    return res.status(200).json({
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      message: "Unable to resend OTP.",
    });
  }
}
function logout(req, res) {
  return res.status(200).json({
    message: "Logged out. Remove the JWT from client storage.",
  });
}

module.exports = { register, login, logout,verifyEmailOTP,resendOTP};