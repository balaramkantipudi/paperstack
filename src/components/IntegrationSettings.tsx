'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [connecting, setConnecting] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadIntegrations()
    }
  }, [user])

  const loadIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations', {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`
        }
      })
      const data = await response.json()
      setIntegrations(data.integrations || [])
    } catch (error) {
      console.error('Failed to load integrations:', error)
    }
  }

  const connectIntegration = async (type: 'quickbooks' | 'xero') => {
    setConnecting(type)
    try {
      const response = await fetch(`/api/integrations/${type}/auth`, {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`
        }
      })
      const data = await response.json()
      
      if (data.auth_url) {
        window.location.href = data.auth_url
      }
    } catch (error) {
      console.error(`Failed to connect ${type}:`, error)
      alert(`Failed to connect ${type}`)
    } finally {
      setConnecting(null)
    }
  }

  const getIntegrationStatus = (type: string) => {
    const integration = integrations.find(i => i.integration_type === type)
    return integration?.is_active ? 'connected' : 'disconnected'
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Accounting Integrations</h2>
      
      {/* QuickBooks Integration */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">QuickBooks</h3>
            <p className="text-gray-600">
              Sync your documents with QuickBooks Online
            </p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                getIntegrationStatus('quickbooks') === 'connected'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {getIntegrationStatus('quickbooks') === 'connected' ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
          <button
            onClick={() => connectIntegration('quickbooks')}
            disabled={connecting === 'quickbooks'}
            className={`px-4 py-2 rounded font-medium ${
              getIntegrationStatus('quickbooks') === 'connected'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {connecting === 'quickbooks' ? 'Connecting...' : 
             getIntegrationStatus('quickbooks') === 'connected' ? 'Reconnect' : 'Connect'}
          </button>
        </div>
      </div>

      {/* Xero Integration */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Xero</h3>
            <p className="text-gray-600">
              Sync your documents with Xero accounting
            </p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                getIntegrationStatus('xero') === 'connected'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {getIntegrationStatus('xero') === 'connected' ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
          <button
            onClick={() => connectIntegration('xero')}
            disabled={connecting === 'xero'}
            className={`px-4 py-2 rounded font-medium ${
              getIntegrationStatus('xero') === 'connected'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {connecting === 'xero' ? 'Connecting...' : 
             getIntegrationStatus('xero') === 'connected' ? 'Reconnect' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  )
}