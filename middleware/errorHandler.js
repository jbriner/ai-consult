const logger = require('../utils/logger');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const correlationId = req.correlationId || 'unknown';

  logger.error('Error occurred', {
    correlationId,
    statusCode,
    message: err.message,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  const response = {
    success: false,
    error: {
      message: statusCode >= 500 ? 'An internal server error occurred' : err.message,
      correlationId,
      timestamp: new Date().toISOString()
    }
  };

  if (!isProduction) {
    response.error.details = {
      originalMessage: err.message,
      stack: err.stack,
      statusCode
    };
  }

  res.status(statusCode).json(response);
};

/**
 * 404 handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

/**
 * Unhandled promise rejection handler
 */
const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', { reason: reason?.toString(), stack: reason?.stack });
    process.exit(1);
  });
};

/**
 * Uncaught exception handler
 */
const handleUncaughtException = () => {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  handleUnhandledRejection,
  handleUncaughtException
};
