import { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { user, error } = await getUser(req)
    
    return res.status(200).json({
      hasAuthHeader: !!req.headers.authorization,
      authHeader: req.headers.authorization?.substring(0, 20) + '...',
      user: user ? {
        id: user.id,
        email: user.email,
        organization_id: user.organization_id
      } : null,
      error
    })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
  }
}