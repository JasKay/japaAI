'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const COUNTRIES = [
  'the UK',
  'the USA',
  'Canada',
  'Australia',
  'Japan',
  'Germany',
  'Singapore',
  'Dubai',
  'Ghana',
]

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0)
  const router = useRouter()

  // Cycle through countries every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCountryIndex((prev) => (prev + 1) % COUNTRIES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        alert('Check your email to confirm signup!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/onboarding')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center px-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600 mb-2">JapaAI</h1>
            <p className="text-xl font-semibold text-gray-900 h-8">
              Move to{' '}
              <span className="text-indigo-600 transition-all duration-500">
                {COUNTRIES[currentCountryIndex]}
              </span>
              <span className="animate-pulse">.</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              with confidence. No agents needed.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading
                ? 'Loading...'
                : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="ml-1 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              No agents. No hidden fees. Just clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
