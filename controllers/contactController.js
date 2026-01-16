const emailService = require('../services/email/EmailService');
const logger = require('../utils/logger');

/**
 * Handle contact form submission
 */
const submitContactForm = async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message too short',
        message: 'Please provide a more detailed message (at least 10 characters)'
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Message too long',
        message: 'Message cannot exceed 5000 characters'
      });
    }

    logger.info('Contact form submission received', {
      name,
      email,
      company: company || 'Not provided',
      service: service || 'Not specified'
    });

    // Send the email
    const result = await emailService.sendContactFormEmail({
      name,
      email,
      company,
      service,
      message
    });

    if (result.success) {
      logger.info('Contact form email sent successfully', { to: email });
      return res.status(200).json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      });
    } else {
      logger.error('Failed to send contact form email', { error: result.error });
      return res.status(500).json({
        success: false,
        error: 'Email sending failed',
        message: 'We could not send your message. Please try again later or contact us directly.'
      });
    }
  } catch (error) {
    logger.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
};

module.exports = {
  submitContactForm
};
