require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  family: 4,
});

async function sendOTPEmail({ to, otp }) {
  const response = await transporter.sendMail({
    from: `"CodeArena" <${process.env.MAIL_FROM}>`,
    to: to,
    subject: "CodeArena Email Verification",
    text: `Your CodeArena verification OTP is ${otp}. It is valid for 5 minutes.`,
    html: `
      <div>
        <h2>CodeArena Email Verification</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `,
  });

  return response;
}

module.exports = sendOTPEmail;

//const { BrevoClient } = require("@getbrevo/brevo");

// const brevo = new BrevoClient({
//   apiKey: process.env.BREVO_API_KEY,
//   timeoutInSeconds: 10,
//   maxRetries: 1,
// });

// async function sendOTPEmail({ to, otp }) {
//   const response = await brevo.transactionalEmails.sendTransacEmail({
//     sender: {
//       name: "CodeArena",
//       email: process.env.MAIL_FROM,
//     },
//     to: [
//       {
//         email: to,
//       },
//     ],
//     subject: "CodeArena Email Verification",
//     textContent: `Your CodeArena verification OTP is ${otp}. It is valid for 5 minutes.`,
//     htmlContent: `
//       <div>
//         <h2>CodeArena Email Verification</h2>
//         <p>Your verification code is:</p>
//         <h1>${otp}</h1>
//         <p>This OTP is valid for 5 minutes.</p>
//       </div>
//     `,
//   });

//   return response;
// }

// module.exports = sendOTPEmail;