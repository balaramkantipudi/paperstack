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
    const organizationId = user.organization_id

    // Get current month's metrics
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    // Total documents this month
    const { data } = await supabaseAdmin
      .from('documents')
      .select('id, status')
      .eq('organization_id', organizationId)
      .gte('created_at', currentMonth.toISOString())
      .lt('created_at', nextMonth.toISOString())

    const totalDocuments = (data as any).length
    const processedDocuments = (data as any).filter((d: any) => d.status === 'processed').length
    const pendingDocuments = (data as any).filter((d: any) => d.status === 'processing' || d.status === 'pending').length
      .gte('created_at', currentMonth.toISOString())
      .lt('created_at', nextMonth.toISOString())

    // Documents by status
    const { data: statusBreakdown } = await supabaseAdmin
      .from('documents')
      .select('ocr_status')
      .eq('organization_id', organizationId)
      .gte('created_at', currentMonth.toISOString())
      .lt('created_at', nextMonth.toISOString())

    const statusCounts = (statusBreakdown as any)?.reduce((acc: any, doc: any) => {
      acc[doc.ocr_status] = (acc[doc.ocr_status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Category breakdown (from line items)
    const { data: categoryData } = await supabaseAdmin
      .from('document_line_items')
      .select(`
        amount,
        category:expense_categories(name),
        document:documents!inner(organization_id, created_at)
      `)
      .eq('document.organization_id', organizationId)
      .gte('document.created_at', currentMonth.toISOString())
      .lt('document.created_at', nextMonth.toISOString())

    // Define the correct type for the category data
    interface CategoryItem {
      amount: number | null;
      category: { name: string } | null;
      document: { organization_id: string; created_at: string };
    }

    const categoryBreakdown = (categoryData as CategoryItem[] | null)?.reduce((acc, item) => {
      const categoryName = item.category?.name || 'Uncategorized'
      acc[categoryName] = (acc[categoryName] || 0) + (item.amount || 0)
      return acc
    }, {} as Record<string, number>) || {}

    // Recent documents
    const { data: recentDocuments } = await supabaseAdmin
      .from('documents')
      .select(`
        id,
        original_filename,
        vendor_name,
        total_amount,
        ocr_status,
        created_at
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(5)

    // Total amount processed
    const { data: amountData } = await supabaseAdmin
      .from('documents')
      .select('total_amount')
      .eq('organization_id', organizationId)
      .gte('created_at', currentMonth.toISOString())
      .lt('created_at', nextMonth.toISOString())
      .not('total_amount', 'is', null)

    const totalAmount = (amountData as any)?.reduce((sum: any, doc: any) => sum + (doc.total_amount || 0), 0) || 0

    return res.status(200).json({
      documents_count: totalDocuments || 0,
      status_breakdown: statusCounts,
      category_breakdown: categoryBreakdown,
      recent_documents: recentDocuments || [],
      total_amount_processed: totalAmount,
      period: {
        start: currentMonth.toISOString(),
        end: nextMonth.toISOString()
      }
    })

  } catch (error) {
    console.error('Dashboard metrics error:', error)
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' })
  }
}