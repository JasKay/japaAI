'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const VISA_TYPES = [
  { value: 'work', label: 'Work Visa', icon: '💼', description: 'Employment sponsorship' },
  { value: 'study', label: 'Student Visa', icon: '🎓', description: 'University education' },
  { value: 'hpi', label: 'HPI Visa', icon: '🚀', description: 'High potential individual' },
  { value: 'graduate', label: 'Graduate Visa', icon: '📚', description: 'Post-study work' },
  { value: 'family', label: 'Family Relocation', icon: '👨‍👩‍👧‍👦', description: 'Family reunification' },
]

export default function Onboarding() {
  const [visaType, setVisaType] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
      } else {
        setUser(user)
      }
    }
    checkUser()
  }, [router])

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!visaType || !departureDate) {
    setError('Please select visa type and departure date')
    return
  }

  setLoading(true)
  setError('')

  try {
    const { error: insertError } = await supabase
      .from('users')
      .upsert(
        {
          id: user?.id,
          email: user?.email,
          visa_type: visaType,
          expected_departure: departureDate,
          home_country: 'Nigeria',
        },
        { onConflict: 'id' }
      )

    if (insertError) throw insertError
    router.push('/dashboard')
  } catch (err: any) {
    setError(err.message || 'Failed to save your preferences')
    console.error('Error:', err)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Let's Personalize Your Journey
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your move to the UK
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          {/* Visa Type Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-6">
              What type of visa are you applying for?
            </label>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {VISA_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setVisaType(type.value)}
                  className={`p-4 sm:p-6 rounded-xl border-2 text-center transition duration-200 ${
                    visaType === type.value
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{type.icon}</div>
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">{type.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Expected Departure Date */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              When do you plan to depart Nigeria?
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              ℹ️ This helps us calculate deadlines for your tasks
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!visaType || !departureDate || loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
          >
            {loading ? 'Setting up your plan...' : '✨ Start Your Journey'}
          </button>

          <p className="text-center text-sm text-gray-500">
            You can change these settings anytime
          </p>
        </form>
      </div>
    </div>
  )
}
