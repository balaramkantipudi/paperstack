'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/useAuth'

interface SyncDocumentsProps {
  selectedDocuments: string[]
  onSyncComplete?: () => void
}

export default function SyncDocuments({ selectedDocuments, onSyncComplete }: SyncDocumentsProps) {
  const [syncing, setSyncing] = useState<string | null>(null)
  const [syncResults, setSyncResults] = useState<any>(null)
  const { user } = useAuth()

  const syncToAccounting = async (platform: 'quickbooks' | 'xero') => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to sync')
      return
    }

    setSyncing(platform)
    setSyncResults(null)

    try {
      const response = await fetch(`/api/integrations/${platform}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify({
          document_ids: selectedDocuments
        })
      })

      const data = await response.json()
      setSyncResults(data)
      
      if (data.success && onSyncComplete) {
        onSyncComplete()
      }
    } catch (error) {
      console.error(`Sync to ${platform} failed:`, error)
      setSyncResults({ 
        success: false, 
        error: `Failed to sync to ${platform}` 
      })
    } finally {
      setSyncing(null)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Sync to Accounting Software
      </h3>
      
      <p className="text-sm text-gray-600">
        {selectedDocuments.length} document(s) selected for sync
      </p>

      <div className="flex space-x-4">
        <button
          onClick={() => syncToAccounting('quickbooks')}
          disabled={syncing !== null || selectedDocuments.length === 0}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing === 'quickbooks' && (
            <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          )}
          Sync to QuickBooks
        </button>

        <button
          onClick={() => syncToAccounting('xero')}
          disabled={syncing !== null || selectedDocuments.length === 0}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing === 'xero' && (
            <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          )}
          Sync to Xero
        </button>
      </div>

      {syncResults && (
        <div className={`p-4 rounded-lg ${syncResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {syncResults.success ? (
            <div>
              <h4 className="font-semibold text-green-800">Sync Completed</h4>
              <p className="text-green-700">
                Successfully synced {syncResults.synced_count} documents
                {syncResults.failed_count > 0 && `, ${syncResults.failed_count} failed`}
              </p>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-red-800">Sync Failed</h4>
              <p className="text-red-700">{syncResults.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}