const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitize plain text to remove potentially dangerous characters
 */
const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return text;

  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Sanitize HTML content
 */
const sanitizeHtml = (dirty) => {
  if (!dirty || typeof dirty !== 'string') return dirty;

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

/**
 * General purpose request sanitization middleware
 */
const sanitizeRequest = (req, res, next) => {
  const fieldsToSanitize = ['title', 'name', 'description', 'message', 'comment', 'content', 'company', 'email'];

  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (fieldsToSanitize.includes(key.toLowerCase()) && typeof req.body[key] === 'string') {
        req.body[key] = sanitizeText(req.body[key]);
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeText(req.query[key]);
      }
    });
  }

  next();
};

/**
 * Escape HTML entities for safe display
 */
const escapeHtml = (unsafe) => {
  if (!unsafe || typeof unsafe !== 'string') return unsafe;

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

module.exports = {
  sanitizeHtml,
  sanitizeText,
  sanitizeRequest,
  escapeHtml
};
