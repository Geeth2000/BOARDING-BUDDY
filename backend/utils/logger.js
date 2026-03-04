/**
 * Production-Ready Logger
 * Uses Winston for file logging in production, console in development
 */

const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

const { config } = require("../config");

// Create logs directory if it doesn't exist
const logDir = config.logDir || "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  }),
);

// Console format with colors for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    let log = `[${timestamp}] ${level}: ${message}`;
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  }),
);

// File transport for errors
const errorFileTransport = new DailyRotateFile({
  filename: path.join(logDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxSize: "20m",
  maxFiles: "30d",
  format: logFormat,
});

// File transport for all logs
const combinedFileTransport = new DailyRotateFile({
  filename: path.join(logDir, "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  format: logFormat,
});

// Create Winston logger
const winstonLogger = winston.createLogger({
  level: config.logLevel || "info",
  transports: [
    // Always log errors to file
    errorFileTransport,
  ],
});

// Add combined file transport in production
if (config.isProduction) {
  winstonLogger.add(combinedFileTransport);
}

// Add console transport (colored in development)
winstonLogger.add(
  new winston.transports.Console({
    format: config.isDevelopment ? consoleFormat : logFormat,
    level: config.isDevelopment ? "debug" : "info",
  }),
);

// Simple API wrapper for backward compatibility
const logger = {
  info: (message, meta = {}) => winstonLogger.info(message, meta),
  success: (message, meta = {}) => winstonLogger.info(`✓ ${message}`, meta),
  warn: (message, meta = {}) => winstonLogger.warn(message, meta),
  error: (message, meta = {}) => {
    if (message instanceof Error) {
      winstonLogger.error(message.message, { stack: message.stack, ...meta });
    } else {
      winstonLogger.error(message, meta);
    }
  },
  debug: (message, meta = {}) => winstonLogger.debug(message, meta),

  // HTTP request logger for Express
  http: (message, meta = {}) => winstonLogger.http(message, meta),

  // Stream for Morgan middleware
  stream: {
    write: (message) => winstonLogger.http(message.trim()),
  },
};

module.exports = logger;
