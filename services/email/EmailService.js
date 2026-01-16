const BrevoEmailProvider = require('./BrevoEmailProvider');
const NodemailerProvider = require('./NodemailerProvider');
const logger = require('../../utils/logger');

/**
 * Universal Email Service for AI Consult
 */
class EmailService {
  constructor() {
    this.currentProvider = null;
    this.providers = new Map();
    this.config = {
      provider: process.env.EMAIL_PROVIDER || 'brevo',
      fallbackProvider: process.env.EMAIL_FALLBACK_PROVIDER || null
    };
  }

  async initialize() {
    try {
      this.registerProviders();

      const primaryInitialized = await this.initializeProvider(this.config.provider);
      if (!primaryInitialized && this.config.fallbackProvider) {
        logger.warn(`Primary provider (${this.config.provider}) failed, trying fallback`);
        const fallbackInitialized = await this.initializeProvider(this.config.fallbackProvider);
        if (!fallbackInitialized) {
          throw new Error('Both email providers failed to initialize');
        }
      } else if (!primaryInitialized) {
        throw new Error(`Email provider (${this.config.provider}) failed to initialize`);
      }

      logger.info('Email service initialized', { provider: this.currentProvider?.constructor.name });
      return true;
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
      return false;
    }
  }

  registerProviders() {
    this.providers.set('brevo', {
      class: BrevoEmailProvider,
      config: {
        apiKey: process.env.BREVO_API_KEY,
        senderName: process.env.BREVO_SENDER_NAME || process.env.APP_NAME || 'AI Consult',
        senderEmail: process.env.BREVO_SENDER_EMAIL || 'noreply@example.com'
      }
    });

    this.providers.set('nodemailer', {
      class: NodemailerProvider,
      config: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        senderName: process.env.SMTP_SENDER_NAME || 'AI Consult'
      }
    });
  }

  async initializeProvider(providerName) {
    try {
      const providerConfig = this.providers.get(providerName);
      if (!providerConfig) {
        throw new Error(`Unknown email provider: ${providerName}`);
      }

      const provider = new providerConfig.class(providerConfig.config);
      const initialized = await provider.initialize();

      if (initialized) {
        this.currentProvider = provider;
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Failed to initialize ${providerName}:`, error);
      return false;
    }
  }

  async sendEmail(emailData) {
    if (!this.currentProvider) {
      return { success: false, error: 'Email service not initialized' };
    }

    try {
      const result = await this.currentProvider.sendEmail(emailData);
      logger.info('Email send attempt', { success: result.success, to: emailData.to });
      return result;
    } catch (error) {
      logger.error('Email send failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendContactFormEmail(formData) {
    const { name, email, company, message, service } = formData;
    const recipient = process.env.CONTACT_FORM_RECIPIENT || process.env.ADMIN_REPORT_EMAIL;

    if (!recipient) {
      logger.error('No contact form recipient configured');
      return { success: false, error: 'Contact form recipient not configured' };
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">New Contact Form Submission</h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${company ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${company}</td>
          </tr>
          ` : ''}
          ${service ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Service:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${service}</td>
          </tr>
          ` : ''}
        </table>

        <div style="margin-top: 20px;">
          <h3 style="color: #333;">Message:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>This message was sent from the AI Consult website contact form.</p>
          <p>Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const text = `
New Contact Form Submission
----------------------------
Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}
${service ? `Service: ${service}` : ''}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString()}
    `;

    return await this.sendEmail({
      to: recipient,
      subject: `New Contact Form: ${name}${company ? ` from ${company}` : ''}`,
      html,
      text,
      replyTo: email
    });
  }

  async testConnection() {
    if (!this.currentProvider) return false;
    return await this.currentProvider.testConnection();
  }

  getProviderInfo() {
    if (!this.currentProvider) return { error: 'No provider initialized' };
    return this.currentProvider.getProviderInfo();
  }
}

module.exports = new EmailService();
