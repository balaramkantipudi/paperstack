'use client'
import { useAuth } from '@/lib/useAuth'
import DocumentUploader from '@/components/DocumentUploader'
import DashboardMetrics from '@/components/DashboardMetrics'

export default function TestUploadPage() {
  const { user, loading, signIn, signOut } = useAuth()

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Login Required</h1>
        <p className="mb-4">Please log in to test document upload.</p>
        
        <form onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const email = formData.get('email') as string
          const password = formData.get('password') as string
          
          const { error } = await signIn(email, password)
          if (error) alert(error.message)
        }}>
          <div className="mb-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Test Document Upload</h1>
        <button onClick={signOut} className="btn-secondary">
          Sign Out
        </button>
      </div>
      
      <div className="mb-8">
        <DashboardMetrics />
      </div>
      
      <DocumentUploader />
    </div>
  )
}