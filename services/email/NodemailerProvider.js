const BaseEmailProvider = require('./BaseEmailProvider');
const nodemailer = require('nodemailer');
const logger = require('../../utils/logger');

/**
 * Nodemailer Email Provider (SMTP)
 */
class NodemailerProvider extends BaseEmailProvider {
  constructor(config) {
    super(config);
    this.transporter = null;
  }

  async initialize() {
    try {
      if (!this.config.host || !this.config.user || !this.config.pass) {
        throw new Error('SMTP host, user, and password are required');
      }

      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port || 587,
        secure: this.config.secure || false,
        auth: {
          user: this.config.user,
          pass: this.config.pass
        },
        tls: {
          rejectUnauthorized: this.config.rejectUnauthorized !== false
        }
      });

      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('Failed to connect to SMTP server');
      }

      this.isInitialized = true;
      logger.info('Nodemailer provider initialized', { host: this.config.host, port: this.config.port });
      return true;
    } catch (error) {
      logger.error('Failed to initialize Nodemailer:', error);
      this.isInitialized = false;
      return false;
    }
  }

  async sendEmail(emailData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Nodemailer provider not initialized');
      }

      const validation = this.validateEmailData(emailData);
      if (!validation.isValid) {
        return this.formatError(new Error(validation.errors.join(', ')), 'Email validation');
      }

      const mailOptions = {
        from: emailData.from || `"${this.config.senderName || 'AI Consult'}" <${this.config.user}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html || null,
        text: emailData.text || null
      };

      if (emailData.cc) mailOptions.cc = emailData.cc;
      if (emailData.bcc) mailOptions.bcc = emailData.bcc;

      const response = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent via Nodemailer', { messageId: response.messageId, to: emailData.to });
      return this.formatSuccess({ messageId: response.messageId, to: emailData.to, subject: emailData.subject });
    } catch (error) {
      logger.error('Failed to send email via Nodemailer:', error);
      return this.formatError(error, 'Send email');
    }
  }

  async sendTemplatedEmail(templateData) {
    logger.warn('Templated email not fully implemented for Nodemailer');
    return this.formatError(new Error('Template loading not implemented'), 'Send templated email');
  }

  async sendBulkEmail(recipients, emailData) {
    try {
      if (!this.isInitialized) throw new Error('Nodemailer provider not initialized');
      if (!recipients || recipients.length === 0) throw new Error('Recipients list is required');

      const results = [];
      for (const recipient of recipients) {
        const recipientEmail = typeof recipient === 'string' ? recipient : recipient.email;
        const result = await this.sendEmail({ ...emailData, to: recipientEmail });
        results.push({ email: recipientEmail, status: result.success ? 'sent' : 'failed' });
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      logger.info('Bulk email completed via Nodemailer', { totalRecipients: recipients.length });
      return this.formatSuccess({
        totalRecipients: recipients.length,
        sent: results.filter(r => r.status === 'sent').length,
        failed: results.filter(r => r.status === 'failed').length,
        results
      });
    } catch (error) {
      logger.error('Failed to send bulk email via Nodemailer:', error);
      return this.formatError(error, 'Send bulk email');
    }
  }

  async testConnection() {
    try {
      if (!this.transporter) return false;
      await this.transporter.verify();
      logger.info('Nodemailer connection test successful');
      return true;
    } catch (error) {
      logger.error('Nodemailer connection test failed:', error);
      return false;
    }
  }

  getProviderInfo() {
    return {
      ...super.getProviderInfo(),
      name: 'Nodemailer (SMTP)',
      features: ['SMTP support', 'Attachments', 'HTML/Text emails'],
      smtpConfig: { host: this.config?.host, port: this.config?.port }
    };
  }
}

module.exports = NodemailerProvider;
