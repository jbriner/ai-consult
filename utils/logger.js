const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Environment-based configuration
const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';

// Determine log level
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...rest }) => {
    let logMessage = `[${timestamp}] ${level}: ${message}`;
    if (Object.keys(rest).length > 0) {
      logMessage += ` ${JSON.stringify(rest)}`;
    }
    return logMessage;
  })
);

// JSON format for files
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create transports
const transports = [
  new winston.transports.Console({
    level: logLevel,
    format: consoleFormat
  })
];

// Add file transport in non-development
if (!isDevelopment) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat
    })
  );
}

const logger = winston.createLogger({
  level: logLevel,
  transports,
  exitOnError: false
});

// Helper methods
logger.logStartup = (serviceName, port, context = {}) => {
  logger.info(`🚀 ${serviceName} started`, { port, environment, ...context });
};

logger.logShutdown = (serviceName, reason = 'Unknown') => {
  logger.info(`🛑 ${serviceName} shutting down`, { reason, uptime: process.uptime() });
};

logger.withCorrelationId = (correlationId) => ({
  error: (msg, err, ctx = {}) => logger.error(msg, { correlationId, error: err?.message, ...ctx }),
  warn: (msg, ctx = {}) => logger.warn(msg, { correlationId, ...ctx }),
  info: (msg, ctx = {}) => logger.info(msg, { correlationId, ...ctx }),
  debug: (msg, ctx = {}) => logger.debug(msg, { correlationId, ...ctx })
});

logger.logAuthEvent = (event, userId, success, details = {}) => {
  if (success) {
    logger.info(`Auth event: ${event}`, { userId, success, ...details });
  } else {
    logger.warn(`Failed auth event: ${event}`, { userId, success, ...details });
  }
};

module.exports = logger;
