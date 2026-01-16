/**
 * Base Email Provider Interface
 */
class BaseEmailProvider {
  constructor(config) {
    this.config = config;
    this.isInitialized = false;
  }

  async initialize() {
    throw new Error('initialize() must be implemented');
  }

  async sendEmail(emailData) {
    throw new Error('sendEmail() must be implemented');
  }

  async sendTemplatedEmail(templateData) {
    throw new Error('sendTemplatedEmail() must be implemented');
  }

  async sendBulkEmail(recipients, emailData) {
    throw new Error('sendBulkEmail() must be implemented');
  }

  async testConnection() {
    throw new Error('testConnection() must be implemented');
  }

  getProviderInfo() {
    return {
      name: this.constructor.name,
      initialized: this.isInitialized,
      config: {
        hasCredentials: !!(this.config?.apiKey || this.config?.user)
      }
    };
  }

  validateEmailData(emailData) {
    const errors = [];
    if (!emailData.to) errors.push('Recipient email (to) is required');
    else if (!this.isValidEmail(emailData.to)) errors.push('Invalid recipient email format');
    if (!emailData.subject) errors.push('Email subject is required');
    if (!emailData.html && !emailData.text) errors.push('Email content (html or text) is required');
    return { isValid: errors.length === 0, errors };
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  formatError(error, operation = 'email operation') {
    return {
      success: false,
      error: `${operation} failed`,
      details: error.message,
      provider: this.constructor.name,
      timestamp: new Date().toISOString()
    };
  }

  formatSuccess(data = {}) {
    return {
      success: true,
      provider: this.constructor.name,
      timestamp: new Date().toISOString(),
      ...data
    };
  }
}

module.exports = BaseEmailProvider;
