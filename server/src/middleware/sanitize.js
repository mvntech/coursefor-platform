const sanitize = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item));
  }

  const sanitized = {};
  const dangerousKeys = ["$", "."];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // check if key contains dangerous characters
      const hasDangerousChar = dangerousKeys.some((char) => key.includes(char));

      if (hasDangerousChar) {
        // skip dangerous keys
        continue;
      }

      // recursively sanitize nested objects
      if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitized[key] = sanitize(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }

  return sanitized;
};

const mongoSanitize = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }
  next();
};

module.exports = mongoSanitize;
