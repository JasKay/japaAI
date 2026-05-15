'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const HOME_COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'India', 'Pakistan', 'Bangladesh', 'Mexico', 'Brazil', 'Philippines', 'Vietnam', 'Indonesia',
]

const DESTINATION_COUNTRIES = [
  'UK', 'USA', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Japan', 'Singapore', 'Dubai', 'New Zealand', 'Ireland', 'Switzerland',
]

const VISA_TYPES = [
  { id: 'work', label: 'Work Visa', emoji: '💼' },
  { id: 'study', label: 'Study Visa', emoji: '🎓' },
  { id: 'hpi', label: 'HPI Visa (Fresh Grad)', emoji: '🌟' },
  { id: 'family', label: 'Family Visa', emoji: '👨‍👩‍👧' },
  { id: 'entrepreneur', label: 'Entrepreneur Visa', emoji: '🚀' },
]

const PROGRESS_STATUSES = [
  { id: 'researching', label: 'Just starting to research', emoji: '🔍', description: 'I\'m exploring options' },
  { id: 'preparing', label: 'Preparing documents', emoji: '📋', description: 'Gathering requirements' },
  { id: 'applying', label: 'Ready to apply', emoji: '📝', description: 'Submitting application soon' },
  { id: 'applied', label: 'Already applied', emoji: '⏳', description: 'Waiting for decision' },
  { id: 'approved', label: 'Visa approved', emoji: '✅', description: 'Got my visa!' },
  { id: 'in_country', label: 'Already here', emoji: '🏠', description: 'I\'ve arrived' },
]

export default function Onboarding() {
  const [page, setPage] = useState(1)
  const [homeCountry, setHomeCountry] = useState('')
  const [destinationCountry, setDestinationCountry] = useState('')
  const [visaType, setVisaType] = useState('')
  const [destinationCity, setDestinationCity] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [progressStatus, setProgressStatus] = useState('')
  const [startFromScratch, setStartFromScratch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth')
        return
      }
      setUser(authUser)
    }
    getUser()
  }, [router])

    // Helper function to map progress status to starting stage
  const statusToStageMap = (status: string): number => {
    const map: Record<string, number> = {
      researching: 1,
      preparing: 2,
      applying: 3,
      applied: 3,
      approved: 4,
      in_country: 5,
    }
    return map[status] || 1
  }

  // Helper function to get friendly recommendation text
  const getStageRecommendationText = (status: string): string => {
    const texts: Record<string, string> = {
      researching: 'You\'re still exploring options. Start from Research & Clarity to understand all requirements.',
      preparing: 'You\'re gathering documents. Start from Document Prep where we\'ll guide you through what\'s needed.',
      applying: 'You\'re ready to apply. Jump straight to Application & Biometrics to submit your visa.',
      applied: 'You\'ve already submitted. Start from Application & Biometrics to track your decision.',
      approved: 'Congrats! Your visa is approved. Start from Arrival to prepare for your move.',
      in_country: 'You\'re already here! Start from Settling & Thriving to complete your relocation journey.',
    }
    return texts[status] || 'Let us guide you through the next steps.'
  }

  const handleSubmit = async () => {
    if (!homeCountry || !destinationCountry || !visaType || !destinationCity || !departureDate || !progressStatus) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const startingStage = startFromScratch ? 1 : statusToStageMap(progressStatus)

      const { error } = await supabase.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          home_country: homeCountry,
          destination: destinationCountry.toLowerCase(),
          visa_type: visaType,
          destination_city: destinationCity.toLowerCase(),
          expected_departure: departureDate,
          current_stage: startingStage,
          onboarding_status: progressStatus,
        },
        { onConflict: 'id' }
      )

      if (error) throw error
      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Let's get you set up</h2>
            <span className="text-sm font-semibold text-indigo-600">
              {page}/6
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(page / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          {/* Page 1 */}
          {page === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Where are you from? 🌍</h3>
              <p className="text-gray-600 mb-6">Which country are you relocating from?</p>
              <div className="grid grid-cols-2 gap-3">
                {HOME_COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => { setHomeCountry(country); setPage(2) }}
                    className={`p-4 rounded-lg border-2 font-semibold transition ${
                      homeCountry === country
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-900'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Page 2 */}
          {page === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Where are you going? ✈️</h3>
              <p className="text-gray-600 mb-6">Which country are you moving to?</p>
              <div className="grid grid-cols-2 gap-3">
                {DESTINATION_COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => { setDestinationCountry(country); setPage(3) }}
                    className={`p-4 rounded-lg border-2 font-semibold transition ${
                      destinationCountry === country
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-900'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(1)}
                className="mt-6 text-gray-600 hover:text-gray-900 font-semibold text-sm"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Page 3 */}
          {page === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Which visa? 📋</h3>
              <p className="text-gray-600 mb-6">What type of visa are you targeting?</p>
              <div className="space-y-3">
                {VISA_TYPES.map((visa) => (
                  <button
                    key={visa.id}
                    onClick={() => { setVisaType(visa.id); setPage(4) }}
                    className={`w-full p-4 rounded-lg border-2 font-semibold transition text-left flex items-center gap-3 ${
                      visaType === visa.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-900'
                    }`}
                  >
                    <span className="text-2xl">{visa.emoji}</span>
                    <span>{visa.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(2)}
                className="mt-6 text-gray-600 hover:text-gray-900 font-semibold text-sm"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Page 4 */}
          {page === 4 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Details 📅</h3>
              <p className="text-gray-600 mb-6">Tell us when and where</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City in {destinationCountry}</label>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="e.g., London, New York"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Departure date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setPage(3)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setPage(5)}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

                    {/* Page 5 - Progress Status */}
          {page === 5 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Where are you in the journey? 🎯</h3>
              <p className="text-gray-600 mb-6">This helps us customize your experience</p>
              <div className="space-y-3 mb-6">
                {PROGRESS_STATUSES.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setProgressStatus(status.id)}
                    className={`w-full p-4 rounded-lg border-2 transition text-left ${
                      progressStatus === status.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{status.emoji}</span>
                      <div>
                        <p className={`font-semibold ${progressStatus === status.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                          {status.label}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{status.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPage(4)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setPage(6)}
                  disabled={!progressStatus}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

                    {/* Page 6 - Personalized recommendation */}
          {page === 6 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your personalized path 🗺️</h3>

              {/* Show current status */}
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 mb-8">
                <p className="text-sm text-indigo-700 font-semibold mb-1">You selected:</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {PROGRESS_STATUSES.find(s => s.id === progressStatus)?.label}
                </p>
              </div>

              {/* Show recommendation */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
                <p className="text-sm text-green-700 font-semibold mb-2">✨ Recommended for you:</p>
                <p className="text-xl font-bold text-green-600 mb-2">
                  Start from Stage {statusToStageMap(progressStatus)}
                </p>
                <p className="text-sm text-green-700">
                  {getStageRecommendationText(progressStatus)}
                </p>
                {statusToStageMap(progressStatus) > 1 && (
                  <p className="text-xs text-green-600 mt-3 italic">
                    You'll still have access to earlier stages if you want to review them.
                  </p>
                )}
              </div>

              {/* Two options */}
              <p className="text-sm font-semibold text-gray-700 mb-4">How would you like to start?</p>
              
              <div className="space-y-3 mb-8">
                {/* Option 1: Start from recommendation */}
                <button
                  onClick={() => setStartFromScratch(false)}
                  className={`w-full p-6 rounded-lg border-2 text-left transition ${
                    !startFromScratch
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div className="flex-1">
                      <p className={`font-semibold ${!startFromScratch ? 'text-indigo-700' : 'text-gray-900'}`}>
                        Jump to Stage {statusToStageMap(progressStatus)}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Start from where you are. Faster path. You can review earlier stages anytime.
                      </p>
                      <p className="text-xs text-indigo-600 font-semibold mt-3">✓ Recommended</p>
                    </div>
                  </div>
                </button>

                {/* Option 2: Start from scratch */}
                <button
                  onClick={() => setStartFromScratch(true)}
                  className={`w-full p-6 rounded-lg border-2 text-left transition ${
                    startFromScratch
                      ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📚</span>
                    <div className="flex-1">
                      <p className={`font-semibold ${startFromScratch ? 'text-orange-700' : 'text-gray-900'}`}>
                        Start from Stage 1 (Complete)
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Go through everything from the beginning. More thorough, but takes longer.
                      </p>
                      <p className="text-xs text-gray-600 mt-3">Best if you want to double-check nothing</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPage(5)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : `Start at Stage ${startFromScratch ? 1 : statusToStageMap(progressStatus)} →`}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
