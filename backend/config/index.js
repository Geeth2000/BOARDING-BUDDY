/**
 * Application Configuration
 * Centralizes all configuration settings
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

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Check if in production
  isProduction: process.env.NODE_ENV === "production",

  // Check if in development
  isDevelopment: process.env.NODE_ENV === "development",
};

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

const validateEnv = () => {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
};

module.exports = { config, validateEnv };
