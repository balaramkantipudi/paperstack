import { supabaseAdmin } from './supabase'

// Type definitions for QuickBooks OAuth
interface QuickBooksToken {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  realmId: string
}

// Mock OAuthClient for build compatibility
class OAuthClient {
  private config: any

  constructor(config: any) {
    this.config = config
  }

  static scopes = {
    Accounting: 'com.intuit.quickbooks.accounting'
  }

  authorizeUri(options: any) {
    const baseUrl = this.config.environment === 'production'
      ? 'https://appcenter.intuit.com/connect/oauth2'
      : 'https://playground-appcenter.intuit.com/connect/oauth2'

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      scope: options.scope.join(' '),
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      access_type: 'offline',
      state: options.state
    })

    return `${baseUrl}?${params.toString()}`
  }

  async createToken(url: string) {
    // This would be implemented with actual OAuth flow
    throw new Error('QuickBooks OAuth not implemented in this demo')
  }

  setToken(token: any) {
    // Set the token for API calls
  }

  async makeApiCall(options: any): Promise<any> {
    // This would make actual API calls to QuickBooks
    console.log('Mock API call:', options);
    return {
      json: {},
      text: () => Promise.resolve(''),
      ok: true
    };
  }

  get environment() {
    return {
      base_url: this.config.environment === 'production'
        ? 'https://quickbooks-api.intuit.com/'
        : 'https://sandbox-quickbooks.api.intuit.com/'
    }
  }
}

export class QuickBooksClient {
  private token: QuickBooksToken
  private companyId: string
  private oauthClient: OAuthClient

  constructor(token: QuickBooksToken, companyId: string) {
    const clientId = import.meta.env.VITE_QUICKBOOKS_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_QUICKBOOKS_CLIENT_SECRET;
    const nextAuthUrl = import.meta.env.VITE_NEXTAUTH_URL;
    if (!clientId || !clientSecret || !nextAuthUrl) {
      throw new Error('Missing QuickBooks environment variables. Please set VITE_QUICKBOOKS_CLIENT_ID, VITE_QUICKBOOKS_CLIENT_SECRET, and VITE_NEXTAUTH_URL in your .env.local');
    }
    this.token = token
    this.companyId = companyId
    this.oauthClient = new OAuthClient({
      clientId,
      clientSecret,
      environment: import.meta.env.MODE === 'production' ? 'production' : 'sandbox',
      redirectUri: `${nextAuthUrl}/api/integrations/quickbooks/callback`
    })
    this.oauthClient.setToken(token)
  }

  async createItem(documentData: any) {
    const itemData = {
      Name: documentData.vendor_name || 'Document Item',
      Description: documentData.document_number || 'Imported from Paperstack',
      UnitPrice: documentData.total_amount || 0,
      Type: 'Service',
      IncomeAccountRef: {
        value: '1', // Default income account
        name: 'Services'
      }
    }

    try {
      const response = await this.oauthClient.makeApiCall({
        url: `${this.oauthClient.environment.base_url}v3/company/${this.companyId}/item`,
        method: 'POST',
        body: itemData
      })
      return response.json
    } catch (error) {
      console.error('QuickBooks create item error:', error)
      throw error
    }
  }

  async createExpense(documentData: any, categoryMapping: Record<string, string>) {
    const expenseData = {
      AccountRef: {
        value: categoryMapping[documentData.category] || '1',
        name: documentData.category || 'Office Expenses'
      },
      PaymentType: 'Cash',
      TotalAmt: documentData.total_amount || 0,
      Line: [{
        Id: '1',
        Amount: documentData.total_amount || 0,
        DetailType: 'AccountBasedExpenseLineDetail',
        AccountBasedExpenseLineDetail: {
          AccountRef: {
            value: categoryMapping[documentData.category] || '1',
            name: documentData.category || 'Office Expenses'
          }
        }
      }],
      EntityRef: {
        value: documentData.vendor_id || '1',
        name: documentData.vendor_name || 'Unknown Vendor'
      }
    }

    try {
      const response = await this.oauthClient.makeApiCall({
        url: `${this.oauthClient.environment.base_url}v3/company/${this.companyId}/purchase`,
        method: 'POST',
        body: expenseData
      })
      return response.json
    } catch (error) {
      console.error('QuickBooks create expense error:', error)
      throw error
    }
  }

  async getAccounts() {
    try {
      const response = await this.oauthClient.makeApiCall({
        url: `${this.oauthClient.environment.base_url}v3/company/${this.companyId}/accounts`,
        method: 'GET'
      })
      return response.json.QueryResponse.Account || []
    } catch (error) {
      console.error('QuickBooks get accounts error:', error)
      throw error
    }
  }

  async createVendor(vendorData: any) {
    const vendor = {
      Name: vendorData.name,
      CompanyName: vendorData.name,
      BillAddr: {
        Line1: vendorData.address,
        City: vendorData.city,
        CountrySubDivisionCode: vendorData.state,
        PostalCode: vendorData.zip
      },
      PrimaryPhone: {
        FreeFormNumber: vendorData.phone
      },
      PrimaryEmailAddr: {
        Address: vendorData.email
      }
    }

    try {
      const response = await this.oauthClient.makeApiCall({
        url: `${this.oauthClient.environment.base_url}v3/company/${this.companyId}/vendor`,
        method: 'POST',
        body: vendor
      })
      return response.json
    } catch (error) {
      console.error('QuickBooks create vendor error:', error)
      throw error
    }
  }
}

export function getQuickBooksAuthUrl(organizationId: string) {
  const clientId = import.meta.env.VITE_QUICKBOOKS_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_QUICKBOOKS_CLIENT_SECRET;
  const nextAuthUrl = import.meta.env.VITE_NEXTAUTH_URL;
  if (!clientId || !clientSecret || !nextAuthUrl) {
    throw new Error('Missing QuickBooks environment variables. Please set VITE_QUICKBOOKS_CLIENT_ID, VITE_QUICKBOOKS_CLIENT_SECRET, and VITE_NEXTAUTH_URL in your .env.local');
  }
  const oauthClient = new OAuthClient({
    clientId,
    clientSecret,
    environment: import.meta.env.MODE === 'production' ? 'production' : 'sandbox',
    redirectUri: `${nextAuthUrl}/api/integrations/quickbooks/callback`
  })
  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: organizationId
  })
  return authUri
}
