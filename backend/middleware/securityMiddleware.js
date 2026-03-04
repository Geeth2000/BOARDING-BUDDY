const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

/**
 * NoSQL Injection Prevention Middleware
 * Sanitizes user input to prevent MongoDB operator injection
 * Example: { "$gt": "" } becomes { "gt": "" }
 */
const sanitizeMongo = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ key, req }) => {
    console.warn(
      `[Security] NoSQL injection attempt blocked - Key: ${key}, IP: ${req.ip}`,
    );
  },
});

/**
 * XSS Protection Middleware
 * Sanitizes user input to prevent cross-site scripting attacks
 * Converts HTML entities: <script> becomes &lt;script&gt;
 */
const xssClean = xss();

/**
 * HTTP Parameter Pollution Prevention
 * Prevents duplicate query parameters from causing issues
 * Whitelist commonly duplicated params that are intentional
 */
const preventParamPollution = hpp({
  whitelist: ["amenities", "sort", "fields", "status", "type", "tags"],
});

/**
 * Custom sanitization middleware for request body
 * Recursively sanitizes string values in objects
 */
const sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

/**
 * Recursively sanitize an object's string values
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return typeof obj === "string" ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip MongoDB operators that start with $
    const sanitizedKey = key.startsWith("$") ? key.substring(1) : key;
    sanitized[sanitizedKey] = sanitizeObject(value);
  }
  return sanitized;
};

/**
 * Sanitize a string value
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;

  // Remove null bytes
  let sanitized = str.replace(/\0/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length to prevent DoS
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized;
};

module.exports = {
  sanitizeMongo,
  xssClean,
  preventParamPollution,
  sanitizeRequestBody,
  sanitizeString,
};
