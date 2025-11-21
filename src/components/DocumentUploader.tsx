'use client'
import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { useAuth } from '@/lib/useAuth'

export default function DocumentUploader() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const { user } = useAuth()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      const result = await apiClient.uploadDocument(file)
      setResult(result)
    } catch (error) {
      setResult({ error: (error as Error).message })
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-red-600">Please log in to upload documents</p>
      </div>
    )
  }

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
      
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileUpload}
        disabled={uploading}
        className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {uploading && (
        <div className="text-blue-600">
          <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          Processing document...
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Result:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
