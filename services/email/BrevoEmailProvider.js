const BaseEmailProvider = require('./BaseEmailProvider');
const brevo = require('@getbrevo/brevo');
const logger = require('../../utils/logger');

/**
 * Brevo (formerly Sendinblue) Email Provider
 */
class BrevoEmailProvider extends BaseEmailProvider {
  constructor(config) {
    super(config);
    this.apiInstance = null;
    this.defaultSender = null;
  }

  async initialize() {
    try {
      if (!this.config.apiKey) {
        throw new Error('Brevo API key is required');
      }

      this.apiInstance = new brevo.TransactionalEmailsApi();
      const apiKey = this.apiInstance.authentications.apiKey;
      apiKey.apiKey = this.config.apiKey;

      this.defaultSender = {
        name: this.config.senderName || 'AI Consult',
        email: this.config.senderEmail || 'noreply@example.com'
      };

      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('Failed to connect to Brevo API');
      }

      this.isInitialized = true;
      logger.info('Brevo email provider initialized', { defaultSender: this.defaultSender });
      return true;
    } catch (error) {
      logger.error('Failed to initialize Brevo:', error);
      this.isInitialized = false;
      return false;
    }
  }

  async sendEmail(emailData) {
    try {
      if (!this.isInitialized) {
        throw new Error('Brevo provider not initialized');
      }

      const validation = this.validateEmailData(emailData);
      if (!validation.isValid) {
        return this.formatError(new Error(validation.errors.join(', ')), 'Email validation');
      }

      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.sender = emailData.from ? this.parseEmailAddress(emailData.from) : this.defaultSender;
      sendSmtpEmail.to = [this.parseEmailAddress(emailData.to)];
      sendSmtpEmail.subject = emailData.subject;
      sendSmtpEmail.htmlContent = emailData.html || null;
      sendSmtpEmail.textContent = emailData.text || null;

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      const messageId = response.body?.messageId || response.messageId || 'unknown';

      logger.info('Email sent via Brevo', { messageId, to: emailData.to, subject: emailData.subject });
      return this.formatSuccess({ messageId, to: emailData.to, subject: emailData.subject });
    } catch (error) {
      logger.error('Failed to send email via Brevo:', error);
      return this.formatError(error, 'Send email');
    }
  }

  async sendTemplatedEmail(templateData) {
    try {
      if (!this.isInitialized) throw new Error('Brevo provider not initialized');
      if (!templateData.to) throw new Error('Recipient email is required');
      if (!templateData.templateId) throw new Error('Template ID is required');

      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.sender = templateData.from ? this.parseEmailAddress(templateData.from) : this.defaultSender;
      sendSmtpEmail.to = [this.parseEmailAddress(templateData.to)];
      sendSmtpEmail.templateId = parseInt(templateData.templateId);
      sendSmtpEmail.params = templateData.variables || {};

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info('Templated email sent via Brevo', { templateId: templateData.templateId, to: templateData.to });
      return this.formatSuccess({ messageId: response.messageId, templateId: templateData.templateId, to: templateData.to });
    } catch (error) {
      logger.error('Failed to send templated email via Brevo:', error);
      return this.formatError(error, 'Send templated email');
    }
  }

  async sendBulkEmail(recipients, emailData) {
    try {
      if (!this.isInitialized) throw new Error('Brevo provider not initialized');
      if (!recipients || recipients.length === 0) throw new Error('Recipients list is required');

      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.sender = emailData.from ? this.parseEmailAddress(emailData.from) : this.defaultSender;
      sendSmtpEmail.to = recipients.map(r => typeof r === 'string' ? this.parseEmailAddress(r) : { email: r.email, name: r.name || null });
      sendSmtpEmail.subject = emailData.subject;
      sendSmtpEmail.htmlContent = emailData.html || null;
      sendSmtpEmail.textContent = emailData.text || null;

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      logger.info('Bulk email sent via Brevo', { recipientCount: recipients.length });
      return this.formatSuccess({ messageId: response.messageId, recipientCount: recipients.length });
    } catch (error) {
      logger.error('Failed to send bulk email via Brevo:', error);
      return this.formatError(error, 'Send bulk email');
    }
  }

  async testConnection() {
    try {
      if (!this.apiInstance) return false;
      const accountApi = new brevo.AccountApi();
      accountApi.authentications.apiKey.apiKey = this.config.apiKey;
      await accountApi.getAccount();
      logger.info('Brevo connection test successful');
      return true;
    } catch (error) {
      logger.error('Brevo connection test failed:', error);
      return false;
    }
  }

  parseEmailAddress(emailString) {
    const match = emailString.match(/^(.+?)\s*<(.+?)>$/);
    if (match) {
      return { name: match[1].trim().replace(/^"|"$/g, ''), email: match[2].trim() };
    }
    return { email: emailString.trim(), name: null };
  }

  getProviderInfo() {
    return {
      ...super.getProviderInfo(),
      name: 'Brevo (Sendinblue)',
      features: ['Transactional emails', 'Template support', 'Bulk emails']
    };
  }
}

module.exports = BrevoEmailProvider;
