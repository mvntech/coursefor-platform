const crypto = require("crypto");

// generate random token for email verification and password reset

exports.generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// hash token (for storing in database)

exports.hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
