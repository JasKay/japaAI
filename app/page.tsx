'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Landing from '@/app/components/Landing'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsAuthenticated(true)
        router.push('/dashboard')
      } else {
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  // If loading, show minimal spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  // If authenticated, they'll be redirected above
  if (isAuthenticated) {
    return null
  }

  // Not authenticated, show landing
  return <Landing />
}
