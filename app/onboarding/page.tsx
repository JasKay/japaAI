'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const VISA_TYPES = [
  { value: 'study', label: 'Student Visa', icon: '🎓' },
  { value: 'work', label: 'Work Visa', icon: '💼' },
  { value: 'hpi', label: 'HPI Visa', icon: '🚀' },
  { value: 'graduate', label: 'Graduate Visa', icon: '📚' },
  { value: 'family', label: 'Family Relocation', icon: '👨‍👩‍👧‍👦' },
]

const DESTINATIONS = [
  { value: 'london', label: 'London', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { value: 'manchester', label: 'Manchester', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { value: 'birmingham', label: 'Birmingham', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { value: 'other', label: 'Other', emoji: '🇬🇧' },
]

const STAGES = [
  { value: 'researching', label: 'Just researching', icon: '🔍' },
  { value: 'applying', label: 'Applying soon', icon: '📝' },
  { value: 'approved', label: 'Visa approved', icon: '✅' },
  { value: 'flight_booked', label: 'Flight booked', icon: '✈️' },
  { value: 'in_uk', label: 'Already in UK', icon: '🇬🇧' },
]

export default function EnhancedOnboarding() {
  const [page, setPage] = useState(1)
  const [visaType, setVisaType] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [currentStage, setCurrentStage] = useState('')
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

  const handleSubmit = async () => {
    if (!visaType || !destination || !departureDate || !currentStage) {
      setError('Please complete all fields')
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
            destination: destination,
            expected_departure: departureDate,
            current_stage: currentStage,
            home_country: 'Nigeria',
          },
          { onConflict: 'id' }
        )

      if (insertError) throw insertError
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const progress = (page / 4) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Build Your Plan</h1>
            <span className="text-sm font-semibold text-indigo-600">
              {page}/4
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Page 1: Visa Type */}
        {page === 1 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What visa are you getting?
            </h2>
            <p className="text-gray-600 mb-8">
              This helps us personalize your journey
            </p>

            <div className="space-y-3">
              {VISA_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setVisaType(type.value)
                    setPage(2)
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    visaType === type.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{type.icon}</span>
                    <span className="font-semibold text-gray-900">
                      {type.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Page 2: Destination */}
        {page === 2 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Where in the UK?
            </h2>
            <p className="text-gray-600 mb-8">
              This affects cost of living, jobs, and housing
            </p>

            <div className="space-y-3">
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest.value}
                  onClick={() => {
                    setDestination(dest.value)
                    setPage(3)
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    destination === dest.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{dest.emoji}</span>
                    <span className="font-semibold text-gray-900">
                      {dest.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(1)}
              className="mt-6 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Page 3: Departure Date */}
        {page === 3 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              When are you leaving?
            </h2>
            <p className="text-gray-600 mb-8">
              We'll calculate your deadline
            </p>

            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg mb-6"
              required
            />

            {departureDate && (
              <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-indigo-900">
                  ⏱️ You have{' '}
                  <strong>
                    {Math.ceil(
                      (new Date(departureDate).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </strong>{' '}
                  to prepare
                </p>
              </div>
            )}

            <button
              onClick={() => setPage(4)}
              disabled={!departureDate}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 mb-4"
            >
              Next →
            </button>

            <button
              onClick={() => setPage(2)}
              className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Page 4: Current Stage */}
        {page === 4 && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Where are you in the process?
            </h2>
            <p className="text-gray-600 mb-8">
              We'll show you the right next steps
            </p>

            <div className="space-y-3 mb-6">
              {STAGES.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => setCurrentStage(stage.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    currentStage === stage.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{stage.icon}</span>
                    <span className="font-semibold text-gray-900">
                      {stage.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!currentStage || loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 mb-4"
            >
              {loading ? 'Creating your plan...' : '✨ See My Personalized Plan'}
            </button>

            <button
              onClick={() => setPage(3)}
              className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
