'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const HOME_COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'India',
  'Pakistan',
  'Bangladesh',
  'Mexico',
  'Brazil',
  'Philippines',
  'Vietnam',
  'Indonesia',
]

const DESTINATION_COUNTRIES = [
  'UK',
  'USA',
  'Canada',
  'Australia',
  'Germany',
  'Netherlands',
  'Japan',
  'Singapore',
  'Dubai',
  'New Zealand',
  'Ireland',
  'Switzerland',
]

const VISA_TYPES = [
  { id: 'work', label: 'Work Visa', emoji: '💼' },
  { id: 'study', label: 'Study Visa', emoji: '🎓' },
  { id: 'hpi', label: 'HPI Visa (Fresh Grad)', emoji: '🌟' },
  { id: 'family', label: 'Family Visa', emoji: '👨‍👩‍👧' },
  { id: 'entrepreneur', label: 'Entrepreneur Visa', emoji: '🚀' },
]

export default function Onboarding() {
  const [page, setPage] = useState(1)
  const [homeCountry, setHomeCountry] = useState('')
  const [destinationCountry, setDestinationCountry] = useState('')
  const [visaType, setVisaType] = useState('')
  const [destinationCity, setDestinationCity] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [currentStage, setCurrentStage] = useState('')
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

  const handleSubmit = async () => {
    if (!homeCountry || !destinationCountry || !visaType || !destinationCity || !departureDate || !currentStage) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          home_country: homeCountry,
          destination: destinationCountry.toLowerCase(),
          visa_type: visaType,
          destination_city: destinationCity.toLowerCase(),
          expected_departure: departureDate,
          current_stage: currentStage,
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
            <h2 className="text-2xl font-bold text-gray-900">Let's get started</h2>
            <span className="text-sm font-semibold text-indigo-600">
              {page}/5
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(page / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          {/* Page 1: Where are you now? */}
          {page === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Where are you now? 🌍
              </h3>
              <p className="text-gray-600 mb-6">
                Which country are you relocating from?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {HOME_COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setHomeCountry(country)
                      setPage(2)
                    }}
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

          {/* Page 2: Where do you want to go? */}
          {page === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Where do you want to go? ✈️
              </h3>
              <p className="text-gray-600 mb-6">
                Which country are you moving to?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {DESTINATION_COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setDestinationCountry(country)
                      setPage(3)
                    }}
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
                className="mt-6 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Page 3: Visa Type */}
          {page === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Which visa are you targeting? 📋
              </h3>
              <p className="text-gray-600 mb-6">
                We'll customize your journey based on this.
              </p>
              <div className="space-y-3">
                {VISA_TYPES.map((visa) => (
                  <button
                    key={visa.id}
                    onClick={() => {
                      setVisaType(visa.id)
                      setPage(4)
                    }}
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
                className="mt-6 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Page 4: City + Date */}
          {page === 4 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                When are you planning to move? 📅
              </h3>
              <p className="text-gray-600 mb-6">
                This helps us create your personalized timeline.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Which city in {destinationCountry}?
                  </label>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="e.g., London, New York, Sydney"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected departure date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none transition"
                  />
                </div>
              </div>

              <button
                onClick={() => setPage(5)}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Next →
              </button>
              <button
                onClick={() => setPage(3)}
                className="mt-3 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Page 5: Current Stage */}
          {page === 5 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Where are you in the process? 🎯
              </h3>
              <p className="text-gray-600 mb-6">
                We'll show you what's next.
              </p>
              <div className="space-y-3">
                {[
                  { id: 'researching', label: 'Still researching', emoji: '🔍' },
                  { id: 'applying', label: 'Ready to apply', emoji: '📝' },
                  { id: 'approved', label: 'Visa approved', emoji: '✅' },
                  { id: 'flight_booked', label: 'Flight booked', emoji: '✈️' },
                  { id: 'in_country', label: 'Already here', emoji: '🏠' },
                ].map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setCurrentStage(stage.id)}
                    className={`w-full p-4 rounded-lg border-2 font-semibold transition text-left flex items-center gap-3 ${
                      currentStage === stage.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-900'
                    }`}
                  >
                    <span className="text-2xl">{stage.emoji}</span>
                    <span>{stage.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Let\'s go! 🚀'}
              </button>
              <button
                onClick={() => setPage(4)}
                className="mt-3 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
