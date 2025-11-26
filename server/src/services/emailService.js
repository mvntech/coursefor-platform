const nodemailer = require("nodemailer");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn(
    "Email configuration missing! EMAIL_USER and EMAIL_PASS must be set in .env file"
  );
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("Email transporter verification failed: ", error.message);
  } else {
    console.log("Email transported is ready to send emails");
  }
});

const sendEmail = async (options) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const error = new Error(
      "Email service not configured. EMAIL_USER and EMAIL_PASS must be set in .env file"
    );
    console.error("Error:", error);
    throw error;
  }

  try {
    const message = {
      from: `${process.env.EMAIL_FROM_NAME || "Course App"} <${
        process.env.EMAIL_USER
      }>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };
    const info = await transporter.sendMail(message);
    console.log("Email sent successfully! Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error: ", error.message);
  }
};

// send welcome email
exports.sendWelcomeEmail = async (user) => {
  const message = `
        <h2>Welcome to Course App, ${user.name}!</h2>
        <p>Thank you for joining our platform. Start exploring amazing courses today!</p>
        <a href="${
          process.env.CLIENT_URL || "http://localhost:4200"
        }/courses" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
            Browse Courses
        </a>
    `;
  return await sendEmail({
    email: user.email,
    subject: "Welcome to Course App!",
    html: message,
  });
};

// send email verification email
exports.sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${
    process.env.CLIENT_URL || "http://localhost:4200"
  }/verify-email/${token}`;

  const message = `
            <h2>Welcome to Course App!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
            Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
    `;
  return await sendEmail({
    email: user.email,
    subject: "Verify your email address",
    html: message,
  });
};

// send password reset email
const resetUrl = `${
  process.env.CLIENT_URL || "http://localhost:4200"
}/reset-password/${token}`;

const message = `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
            Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
    `;

return await sendEmail({
  email: user.email,
  subject: "Password Reset Request",
  html: message,
});

module.exports = exports;
