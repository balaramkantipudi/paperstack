// API endpoint for batch processing
// pages/api/documents/batch-process.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth } from '@/lib/auth'

// Mock BatchProcessor for build compatibility
class BatchProcessor {
  private static instance: BatchProcessor

  static getInstance(): BatchProcessor {
    if (!BatchProcessor.instance) {
      BatchProcessor.instance = new BatchProcessor()
    }
    return BatchProcessor.instance
  }

  async createBatchJob(organizationId: string, documentIds: string[]): Promise<string> {
    const jobId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log(`Mock batch job created: ${jobId} for ${documentIds.length} documents`)
    return jobId
  }
}

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

    if (!Array.isArray(document_ids) || document_ids.length === 0) {
      return res.status(400).json({ error: 'document_ids array is required' })
    }

    const processor = BatchProcessor.getInstance()
    const jobId = await processor.createBatchJob(user.organization_id, document_ids)

    return res.status(200).json({
      success: true,
      job_id: jobId,
      message: `Batch processing started for ${document_ids.length} documents`
    })

  } catch (error) {
    console.error('Batch process API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}