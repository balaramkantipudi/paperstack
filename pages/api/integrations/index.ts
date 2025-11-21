import { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await requireAuth(req)

    const { data: integrations, error } = await supabaseAdmin
      .from('integration_settings')
      .select('integration_type, is_active, last_sync_at, created_at')
      .eq('organization_id', user.organization_id)

    if (error) {
      throw error
    }

    return res.status(200).json({
      integrations: integrations || []
    })

  } catch (error) {
    console.error('Get integrations error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}