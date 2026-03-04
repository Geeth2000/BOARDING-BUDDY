/**
 * Boarding Buddy - Backend Server
 * Main application entry point
 * Production-ready configuration
 */

// Load environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// Config
const connectDB = require("./config/db");
const { config, validateEnv } = require("./config");

// Logger
const logger = require("./utils/logger");

// Middleware
const {
  notFound,
  errorHandler,
  apiLimiter,
  sanitizeMongo,
  xssClean,
  preventParamPollution,
  sanitizeRequestBody,
} = require("./middleware");

// Routes
const {
  testRoutes,
  authRoutes,
  propertyRoutes,
  bookingRoutes,
  reviewRoutes,
  messageRoutes,
  analyticsRoutes,
} = require("./routes");

// Validate environment variables
validateEnv();

// Initialize Express app
const app = express();

// Trust proxy (required for rate limiting behind reverse proxy)
if (config.isProduction) {
  app.set("trust proxy", 1);
}

// Connect to MongoDB
connectDB();

// Compression middleware (gzip)
app.use(compression());

// Security Middleware - Enhanced Helmet configuration
app.use(
  helmet({
    contentSecurityPolicy: config.isProduction ? undefined : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS Configuration - Production ready
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = Array.isArray(config.corsOrigin)
      ? config.corsOrigin
      : [config.corsOrigin];

    if (allowedOrigins.includes(origin) || config.isDevelopment) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-Total-Count", "X-Total-Pages"],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Rate limiting
app.use("/api", apiLimiter);

// Body parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser with secure options
app.use(cookieParser(config.jwtSecret));

// Data sanitization & security
app.use(sanitizeMongo); // Prevent NoSQL injection
app.use(xssClean); // Prevent XSS attacks
app.use(preventParamPollution); // Prevent HTTP parameter pollution
app.use(sanitizeRequestBody); // Custom input sanitization

// HTTP request logging
if (config.isProduction) {
  // Production: log to file via Winston
  app.use(morgan("combined", { stream: logger.stream }));
} else {
  // Development: colored console output
  app.use(morgan("dev"));
}

// API Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check endpoint (for load balancers)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Boarding Buddy API",
    version: "1.0.0",
    environment: config.nodeEnv,
    docs: "/api/test/health",
  });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT} in ${config.nodeEnv} mode`);

  if (!config.isProduction) {
    console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║   🚀 Boarding Buddy Server is running!                 ║
  ║                                                        ║
  ║   Environment: ${config.nodeEnv.padEnd(39)}║
  ║   Port: ${String(PORT).padEnd(46)}║
  ║   API: http://localhost:${PORT}/api${" ".repeat(26)}║
  ║   Health: http://localhost:${PORT}/health${" ".repeat(19)}║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
    `);
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection", { error: err.message, stack: err.stack });
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { error: err.message, stack: err.stack });
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Process terminated.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Process terminated.");
    process.exit(0);
  });
});

module.exports = app;
