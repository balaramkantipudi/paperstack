import { NextApiRequest, NextApiResponse } from 'next'
import OAuthClient from 'intuit-oauth'
import { supabaseAdmin } from '@/lib/supabase'

const oauthClient = new OAuthClient({
  clientId: process.env.QUICKBOOKS_CLIENT_ID!,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  redirectUri: `${process.env.NEXTAUTH_URL}/api/integrations/quickbooks/callback`
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, state: organizationId, realmId } = req.query

    if (!code || !organizationId || !realmId) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Exchange code for tokens
    const authResponse = await oauthClient.createToken(req.url!)
    const tokens = authResponse.token

    // Store integration settings
    const { error } = await supabaseAdmin
      .from('integration_settings')
      .upsert({
        organization_id: organizationId,
        integration_type: 'quickbooks',
        credentials: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_type: tokens.token_type,
          expires_in: tokens.expires_in,
          realmId: realmId
        },
        is_active: true
      })

    if (error) {
      throw error
    }

    // Redirect to success page
    return res.redirect('/dashboard?integration=quickbooks&status=success')
  } catch (error) {
    console.error('QuickBooks callback error:', error)
    return res.redirect('/dashboard?integration=quickbooks&status=error')
  }
}