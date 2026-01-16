const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');
const { contactFormLimiter } = require('../middleware/rateLimiting');

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public (rate limited)
 */
router.post('/', contactFormLimiter, submitContactForm);

module.exports = router;
