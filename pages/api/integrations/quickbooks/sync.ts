import { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { QuickBooksClient } from '@/lib/quickbooks-client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await requireAuth(req)
    const { document_ids } = req.body

    // Get QuickBooks integration
    const { data: integration, error: integrationError } = await supabaseAdmin
      .from('integration_settings')
      .select('credentials')
      .eq('organization_id', user.organization_id)
      .eq('integration_type', 'quickbooks')
      .eq('is_active', true)
      .single()

    if (integrationError || !integration) {
      return res.status(400).json({ error: 'QuickBooks integration not found' })
    }

    // Get documents to sync
    const { data: documents, error: docsError } = await supabaseAdmin
      .from('documents')
      .select(`
        *,
        line_items:document_line_items(
          *,
          category:expense_categories(name)
        )
      `)
      .in('id', document_ids)
      .eq('organization_id', user.organization_id)

    if (docsError || !documents) {
      return res.status(400).json({ error: 'Documents not found' })
    }

    const qbClient = new QuickBooksClient(
      integration.credentials,
      integration.credentials.realmId
    )

    const results = []

    for (const document of documents) {
      try {
        // Create expense in QuickBooks
        const expense = await qbClient.createExpense(document, {
          'Materials': '1',
          'Labor': '2',
          'Equipment Rental': '3',
          // Add more category mappings
        })

        results.push({
          document_id: document.id,
          success: true,
          quickbooks_id: expense.Purchase?.Id
        })

        // Update document with sync status
        await supabaseAdmin
          .from('documents')
          .update({ 
            notes: `${document.notes || ''}\nSynced to QuickBooks: ${expense.Purchase?.Id}` 
          })
          .eq('id', document.id)

      } catch (error) {
        results.push({
          document_id: document.id,
          success: false,
          error: error.message
        })
      }
    }

    return res.status(200).json({
      success: true,
      results,
      synced_count: results.filter(r => r.success).length,
      failed_count: results.filter(r => !r.success).length
    })

  } catch (error) {
    console.error('QuickBooks sync error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}