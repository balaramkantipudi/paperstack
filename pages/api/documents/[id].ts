import { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid document ID' })
  }

  try {
    const user = await requireAuth(req)

    if (req.method === 'GET') {
      // Get document with all related data
      const { data: document, error } = await supabaseAdmin
        .from('documents')
        .select(`
          *,
          vendor:vendors(name, id),
          line_items:document_line_items(*),
          processing_history:document_processing_history(*)
        `)
        .eq('id', id)
        .eq('organization_id', user.organization_id)
        .single()

      if (error || !document) {
        return res.status(404).json({ error: 'Document not found' })
      }

      return res.status(200).json({ document })

    } else if (req.method === 'PUT') {
      // Update document
      const updates = req.body
      
      // Validate updates
      const allowedFields = [
        'vendor_name', 'document_date', 'due_date', 'document_number',
        'total_amount', 'tax_amount', 'notes', 'is_verified'
      ]
      
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce<Record<string, unknown>>((obj, key) => {
          obj[key] = updates[key]
          return obj
        }, {})

      const { data: document, error } = await supabaseAdmin
        .from('documents')
        .update(filteredUpdates)
        .eq('id', id)
        .eq('organization_id', user.organization_id)
        .select()
        .single()

      if (error) {
        return res.status(500).json({ error: 'Failed to update document' })
      }

      return res.status(200).json({ document })

    } else if (req.method === 'DELETE') {
      // Delete document
      const { error } = await supabaseAdmin
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.organization_id)

      if (error) {
        return res.status(500).json({ error: 'Failed to delete document' })
      }

      return res.status(200).json({ success: true })

    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error: unknown) {
    console.error('Document API error:', error)
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' })
  }
}
