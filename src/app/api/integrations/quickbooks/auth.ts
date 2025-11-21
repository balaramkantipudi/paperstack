import { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from '@/lib/auth'
import { getQuickBooksAuthUrl } from '@/lib/quickbooks-client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await requireAuth(req)
    const authUrl = getQuickBooksAuthUrl(user.organization_id)
    
    return res.status(200).json({ auth_url: authUrl })
  } catch (error) {
    console.error('QuickBooks auth error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}