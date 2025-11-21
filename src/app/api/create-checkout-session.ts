import { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from '@/lib/auth'
import { getStripeSession } from '@/lib/stripe'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await requireAuth(req)
    const { price_id } = req.body

    const session = await getStripeSession(
      user.organization_id,
      price_id,
      user.id
    )

    return res.status(200).json({ url: session.url })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
  }
}