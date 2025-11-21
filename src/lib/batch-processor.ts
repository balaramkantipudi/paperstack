import { supabaseAdmin } from './supabase'
import { finalEnhancedDocumentProcessingPipeline } from './document-processor'

export interface BatchProcessingJob {
  id: string
  organization_id: string
  document_ids: string[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  total_documents: number
  processed_documents: number
  failed_documents: number
  created_at: string
  completed_at?: string
  error_message?: string
}

export class BatchProcessor {
  private static instance: BatchProcessor
  private processingQueue: Map<string, BatchProcessingJob> = new Map()
  private maxConcurrentJobs = 3

  static getInstance(): BatchProcessor {
    if (!BatchProcessor.instance) {
      BatchProcessor.instance = new BatchProcessor()
    }
    return BatchProcessor.instance
  }

  async createBatchJob(organizationId: string, documentIds: string[]): Promise<string> {
    const jobId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const job: BatchProcessingJob = {
      id: jobId,
      organization_id: organizationId,
      document_ids: documentIds,
      status: 'pending',
      progress: 0,
      total_documents: documentIds.length,
      processed_documents: 0,
      failed_documents: 0,
      created_at: new Date().toISOString()
    }

    this.processingQueue.set(jobId, job)

    // Start processing asynchronously
    this.processBatchJob(jobId).catch(error => {
      console.error(`Batch job ${jobId} failed:`, error)
    })

    return jobId
  }

  async getBatchJobStatus(jobId: string): Promise<BatchProcessingJob | null> {
    return this.processingQueue.get(jobId) || null
  }

  private async processBatchJob(jobId: string) {
    const job = this.processingQueue.get(jobId)
    if (!job) return

    job.status = 'processing'

    try {
      const results = await Promise.allSettled(
        job.document_ids.map(async (documentId, index) => {
          try {
            await finalEnhancedDocumentProcessingPipeline(documentId)
            job.processed_documents++
            job.progress = Math.round((job.processed_documents / job.total_documents) * 100)
          } catch (error) {
            job.failed_documents++
            console.error(`Failed to process document ${documentId}:`, error)
            throw error
          }
        })
      )

      // Check results
      const failedCount = results.filter(result => result.status === 'rejected').length

      if (failedCount === 0) {
        job.status = 'completed'
      } else if (failedCount === job.total_documents) {
        job.status = 'failed'
        job.error_message = 'All documents failed to process'
      } else {
        job.status = 'completed' // Partial success
        job.error_message = `${failedCount} documents failed to process`
      }

      job.completed_at = new Date().toISOString()
      job.progress = 100

    } catch (error) {
      job.status = 'failed'
      job.error_message = error.message
      job.completed_at = new Date().toISOString()
    }
  }
}