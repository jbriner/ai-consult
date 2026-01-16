const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

/**
 * General API rate limiter
 */
const apiLimiter = process.env.NODE_ENV === 'development'
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per window
      message: {
        success: false,
        error: 'Too many requests',
        message: 'Please try again later'
      },
      standardHeaders: true,
      legacyHeaders: false
    });

/**
 * Stricter rate limiter for contact form
 */
const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 contact form submissions per hour
  message: {
    success: false,
    error: 'Too many submissions',
    message: 'You can only submit the contact form 5 times per hour. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Contact form rate limit exceeded', { ip: req.ip });
    res.status(429).json({
      success: false,
      error: 'Too many submissions',
      message: 'You can only submit the contact form 5 times per hour. Please try again later.'
    });
  }
});

module.exports = {
  apiLimiter,
  contactFormLimiter
};
