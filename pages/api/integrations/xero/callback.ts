import { NextApiRequest, NextApiResponse } from 'next'
import { XeroIntegration } from '@/lib/xero-client'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { state: organizationId } = req.query

    if (!organizationId) {
      return res.status(400).json({ error: 'Missing organization ID' })
    }

    const xero = new XeroIntegration()
    const tokenSet = await xero.exchangeCodeForTokens(req.url!)

    // Store integration settings
    const { error } = await supabaseAdmin
      .from('integration_settings')
      .upsert({
        organization_id: organizationId,
        integration_type: 'xero',
        credentials: {
          access_token: tokenSet.access_token,
          refresh_token: tokenSet.refresh_token,
          id_token: tokenSet.id_token,
          token_type: tokenSet.token_type,
          expires_at: tokenSet.expires_at,
          scope: tokenSet.scope
        },
        is_active: true
      })

    if (error) {
      throw error
    }

    return res.redirect('/dashboard?integration=xero&status=success')
  } catch (error) {
    console.error('Xero callback error:', error)
    return res.redirect('/dashboard?integration=xero&status=error')
  }
}