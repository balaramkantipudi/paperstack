import { supabaseAdmin } from './supabase'

// Mock XeroClient for build compatibility
class XeroClient {
  private config: any

  constructor(config: any) {
    this.config = config
  }

  buildConsentUrl(state: string) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUris[0],
      scope: this.config.scopes,
      state: state
    })

    return `https://login.xero.com/identity/connect/authorize?${params.toString()}`
  }

  async apiCallback(url: string) {
    // This would exchange the code for tokens
    throw new Error('Xero OAuth not implemented in this demo')
  }

  async setTokenSet(tokens: any) {
    // Set tokens for API calls
  }

  get accountingApi() {
    return {
      createContacts: async (tenantId: string, data: any) => {
        console.log('Mock createContacts:', tenantId, data);
        return { body: { contacts: [data.contacts[0]] } };
      },
      createInvoices: async (tenantId: string, data: any) => {
        console.log('Mock createInvoices:', tenantId, data);
        return { body: { invoices: [data.invoices[0]] } };
      },
      getAccounts: async (tenantId: string) => {
        console.log('Mock getAccounts:', tenantId);
        return { body: { accounts: [] } };
      }
    }
  }
}

export class XeroIntegration {
  private client: XeroClient

  constructor() {
    const clientId = import.meta.env.VITE_XERO_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_XERO_CLIENT_SECRET;
    const nextAuthUrl = import.meta.env.VITE_NEXTAUTH_URL;
    if (!clientId || !clientSecret || !nextAuthUrl) {
      throw new Error('Missing Xero environment variables. Please set VITE_XERO_CLIENT_ID, VITE_XERO_CLIENT_SECRET, and VITE_NEXTAUTH_URL in your .env.local');
    }
    this.client = new XeroClient({
      clientId,
      clientSecret,
      redirectUris: [`${nextAuthUrl}/api/integrations/xero/callback`],
      scopes: 'accounting.transactions accounting.contacts accounting.settings'
    })
  }

  getAuthUrl(organizationId: string) {
    return this.client.buildConsentUrl(organizationId)
  }

  async exchangeCodeForTokens(url: string) {
    return await this.client.apiCallback(url)
  }

  async createContact(vendorData: any, tenantId: string, tokens: any) {
    await this.client.setTokenSet(tokens)

    const contact = {
      name: vendorData.name,
      emailAddress: vendorData.email,
      phones: vendorData.phone ? [{
        phoneType: 'DEFAULT',
        phoneNumber: vendorData.phone
      }] : [],
      addresses: vendorData.address ? [{
        addressType: 'POBOX',
        addressLine1: vendorData.address,
        city: vendorData.city,
        region: vendorData.state,
        postalCode: vendorData.zip
      }] : [],
      isSupplier: true
    }

    try {
      const response = await this.client.accountingApi.createContacts(tenantId, {
        contacts: [contact]
      })
      return response.body.contacts?.[0]
    } catch (error) {
      console.error('Xero create contact error:', error)
      throw error
    }
  }

  async createBill(documentData: any, tenantId: string, tokens: any) {
    await this.client.setTokenSet(tokens)

    const bill = {
      type: 'ACCPAY',
      contact: {
        contactID: documentData.xero_contact_id || '00000000-0000-0000-0000-000000000000'
      },
      date: documentData.document_date || new Date().toISOString().split('T')[0],
      dueDate: documentData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reference: documentData.document_number,
      lineItems: documentData.line_items?.map((item: any) => ({
        description: item.description,
        quantity: item.quantity || 1,
        unitAmount: item.unit_price || item.amount,
        accountCode: this.getCategoryAccountCode(item.category?.name)
      })) || [{
        description: 'Imported expense',
        unitAmount: documentData.total_amount || 0,
        accountCode: '400' // Default expense account
      }]
    }

    try {
      const response = await this.client.accountingApi.createInvoices(tenantId, {
        invoices: [bill]
      })
      return response.body.invoices?.[0]
    } catch (error) {
      console.error('Xero create bill error:', error)
      throw error
    }
  }

  private getCategoryAccountCode(categoryName?: string): string {
    const categoryMapping: Record<string, string> = {
      'Materials': '300',
      'Labor': '400',
      'Equipment Rental': '500',
      'Tools': '520',
      'Office Expenses': '600',
      'Transportation': '700'
    }

    return categoryMapping[categoryName || ''] || '400'
  }

  async getAccounts(tenantId: string, tokens: any) {
    await this.client.setTokenSet(tokens)

    try {
      const response = await this.client.accountingApi.getAccounts(tenantId)
      return response.body.accounts || []
    } catch (error) {
      console.error('Xero get accounts error:', error)
      throw error
    }
  }
}
