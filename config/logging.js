/**
 * Logging Configuration for AI Consult
 */

const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';
const isQA = environment === 'qa';
const isDevelopment = environment === 'development';

const config = {
  environment,
  isProduction,
  isQA,
  isDevelopment,

  // Log levels by environment
  logLevel: isDevelopment ? 'debug' : (isQA ? 'info' : 'warn'),

  // Console output
  logToConsole: isDevelopment || process.env.LOG_TO_CONSOLE === 'true',

  // File output
  logToFile: !isDevelopment || process.env.LOG_TO_FILE === 'true',

  // Sensitive fields to redact in logs
  sensitiveFields: ['password', 'token', 'secret', 'key', 'authorization', 'cookie', 'session']
};

/**
 * Sanitize an object by removing sensitive fields
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = { ...obj };
  config.sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  });

  return sanitized;
};

module.exports = {
  config,
  sanitizeObject,
  isProduction,
  isDevelopment,
  isQA
};
