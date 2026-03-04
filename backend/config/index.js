/**
 * Application Configuration
 * Centralizes all configuration settings for development and production
 */

const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,

  // MongoDB
  mongoUri: process.env.MONGO_URI,

  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "30d",

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  rateLimitMaxRequests:
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,

  // CORS - Support multiple origins in production
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : "http://localhost:5173",

  // Cookie Settings
  cookie: {
    secure:
      process.env.COOKIE_SECURE === "true" ||
      process.env.NODE_ENV === "production",
    sameSite:
      process.env.COOKIE_SAME_SITE ||
      (process.env.NODE_ENV === "production" ? "strict" : "lax"),
    domain: process.env.COOKIE_DOMAIN || undefined,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
  logDir: process.env.LOG_DIR || "logs",

  // Check if in production
  isProduction: process.env.NODE_ENV === "production",

  // Check if in development
  isDevelopment: process.env.NODE_ENV === "development",

  // Check if in test
  isTest: process.env.NODE_ENV === "test",
};

// Required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

// Additional required vars in production
const productionRequiredVars = [...requiredEnvVars];

const validateEnv = () => {
  const varsToCheck = config.isProduction
    ? productionRequiredVars
    : requiredEnvVars;
  const missingVars = varsToCheck.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  // Warn about insecure JWT secret in production
  if (config.isProduction && process.env.JWT_SECRET?.length < 32) {
    console.warn(
      "WARNING: JWT_SECRET should be at least 32 characters in production",
    );
  }

  // Warn about default values in production
  if (config.isProduction) {
    if (process.env.JWT_SECRET?.includes("change_this")) {
      throw new Error("Please set a secure JWT_SECRET for production");
    }
  }
};

module.exports = { config, validateEnv };
