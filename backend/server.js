/**
 * Boarding Buddy - Backend Server
 * Main application entry point
 */

// Load environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Config
const connectDB = require("./config/db");
const { config, validateEnv } = require("./config");

// Middleware
const { notFound, errorHandler, apiLimiter } = require("./middleware");

// Routes
const {
  testRoutes,
  authRoutes,
  propertyRoutes,
  bookingRoutes,
} = require("./routes");

// Validate environment variables
validateEnv();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet()); // Set security headers
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
app.use("/api", apiLimiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Logging middleware (development only)
if (config.isDevelopment) {
  app.use(morgan("dev"));
}

// API Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
// Add more routes here as you create them
// app.use('/api/users', userRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Boarding Buddy API",
    version: "1.0.0",
    docs: "/api/test/health",
  });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║   🚀 Boarding Buddy Server is running!                 ║
  ║                                                        ║
  ║   Environment: ${config.nodeEnv.padEnd(39)}║
  ║   Port: ${String(PORT).padEnd(46)}║
  ║   API: http://localhost:${PORT}/api/test${" ".repeat(21)}║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
});

module.exports = app;
