import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { QuickBooksClient } from '@/lib/quickbooks-client'
import { XeroIntegration } from '@/lib/xero-client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { document_id, organization_id } = req.body

    // Get document details
    const { data: document, error: docError } = await (supabaseAdmin as any)
      .from('documents')
      .select(`
        *,
        line_items:document_line_items(
          *,
          category:expense_categories(name)
        )
      `)
      .eq('id', document_id)
      .eq('organization_id', organization_id)
      .single()

    if (docError || !document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    // Get active integrations
    const { data: integrations, error: intError } = await supabaseAdmin
      .from('integration_settings')
      .select('integration_type, credentials, settings')
      .eq('organization_id', organization_id)
      .eq('is_active', true)

    if (intError || !integrations || integrations.length === 0) {
      return res.status(200).json({ message: 'No active integrations' })
    }

    const results = []

    for (const integration of integrations) {
      try {
        let syncResult = null

        if ((integration as any).integration_type === 'quickbooks') {
          const qbClient = new QuickBooksClient(
            (integration as any).credentials,
            (integration as any).credentials.realmId
          )
          syncResult = await qbClient.createExpense(document, {
            'Materials': '1',
            'Labor': '2',
            // Add more mappings
          })
        } else if ((integration as any).integration_type === 'xero') {
          const xero = new XeroIntegration()
          syncResult = await xero.createBill(
            document,
            (integration as any).credentials.tenant_id,
            (integration as any).credentials
          )
        }

        results.push({
          integration: (integration as any).integration_type,
          success: true,
          result: syncResult
        })

      } catch (error) {
        results.push({
          integration: (integration as any).integration_type,
          success: false,
          error: error.message
        })
      }
    }

    // Update document with sync status
    const syncNotes = results
      .map(r => `${r.integration}: ${r.success ? 'synced' : 'failed'}`)
      .join(', ')

    await (supabaseAdmin as any)
      .from('documents')
      .update({
        notes: `${(document as any).notes || ''}\nAuto-sync: ${syncNotes}`
      } as any)
      .eq('id', document_id)

    return res.status(200).json({
      success: true,
      results,
      synced_count: results.filter(r => r.success).length
    })

  } catch (error) {
    console.error('Auto-sync webhook error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}