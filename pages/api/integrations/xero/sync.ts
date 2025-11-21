import { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { XeroIntegration } from '@/lib/xero-client'

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

    // Get Xero integration
    const { data: integration, error: integrationError } = await supabaseAdmin
      .from('integration_settings')
      .select('credentials')
      .eq('organization_id', user.organization_id)
      .eq('integration_type', 'xero')
      .eq('is_active', true)
      .single()

    if (integrationError || !integration) {
      return res.status(400).json({ error: 'Xero integration not found' })
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

    const xero = new XeroIntegration()
    const tenantId = integration.credentials.tenant_id || 'default'
    const results = []

    for (const document of documents) {
      try {
        // Create bill in Xero
        const bill = await xero.createBill(document, tenantId, integration.credentials)

        results.push({
          document_id: document.id,
          success: true,
          xero_id: bill?.invoiceID
        })

        // Update document with sync status
        await supabaseAdmin
          .from('documents')
          .update({ 
            notes: `${document.notes || ''}\nSynced to Xero: ${bill?.invoiceID}` 
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
    console.error('Xero sync error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}