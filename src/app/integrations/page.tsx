'use client'
import IntegrationSettings from '@/components/IntegrationSettings'
import { useAuth } from '@/lib/useAuth'

export default function IntegrationsPage() {
 const { user } = useAuth()

 if (!user) {
   return <div>Please log in to manage integrations</div>
 }

 return (
   <div className="container mx-auto p-8">
     <IntegrationSettings />
   </div>
 )
}