// Stub implementation for intuit-oauth
class OAuthClient {
  constructor(options) {
    this.options = options;
    this.environment = {
      base_url: 'https://sandbox-quickbooks.api.intuit.com/',
      production: false,
    };
  }

  static get scopes() {
    return {
      Accounting: 'com.intuit.quickbooks.accounting',
    };
  }

  authorizeUri(options) {
    return `https://appcenter.intuit.com/connect/oauth2?state=${options.state}`;
  }

  createToken(url) {
    return Promise.resolve({
      token: {
        access_token: 'stub-access-token',
        refresh_token: 'stub-refresh-token',
        token_type: 'bearer',
        expires_in: 3600,
      }
    });
  }

  setToken(token) {
    this.token = token;
  }

  makeApiCall(options) {
    return Promise.resolve({
      json: {
        QueryResponse: {
          Account: []
        }
      }
    });
  }
}

// For CommonJS compatibility
module.exports = OAuthClient;
module.exports.default = OAuthClient;
