'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const VISA_TYPES = [
  { id: 'work', label: 'Work Visa', emoji: '💼' },
  { id: 'study', label: 'Study Visa', emoji: '🎓' },
  { id: 'hpi', label: 'HPI Visa', emoji: '🌟' },
  { id: 'family', label: 'Family Visa', emoji: '👨‍👩‍👧' },
  { id: 'entrepreneur', label: 'Entrepreneur Visa', emoji: '🚀' },
]

const DESTINATION_COUNTRIES = [
  'UK', 'USA', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Japan', 'Singapore', 'Dubai', 'New Zealand', 'Ireland', 'Switzerland',
]

const HOME_COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'India', 'Pakistan', 'Bangladesh', 'Mexico', 'Brazil', 'Philippines', 'Vietnam', 'Indonesia',
]

interface EditProfileModalProps {
  isOpen: boolean
  userData: any
  userId: string
  onClose: () => void
  onSave: () => void
}

export default function EditProfileModal({
  isOpen,
  userData,
  userId,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [visaType, setVisaType] = useState(userData?.visa_type || '')
  const [destination, setDestination] = useState(userData?.destination || '')
  const [homeCountry, setHomeCountry] = useState(userData?.home_country || '')
  const [departureDate, setDepartureDate] = useState(userData?.expected_departure || '')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'origin' | 'destination' | 'visa' | 'date'>('origin')

  const handleSave = async () => {
    if (!visaType || !destination || !homeCountry || !departureDate) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          visa_type: visaType,
          destination: destination.toLowerCase(),
          home_country: homeCountry,
          expected_departure: departureDate,
        })
        .eq('id', userId)

      if (error) throw error
      onSave()
      onClose()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Update Profile</h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80 text-2xl"
            >
              ✕
            </button>
          </div>
          <p className="text-indigo-100 text-sm mt-2">Customize your relocation journey</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: 'origin', label: 'From', emoji: '📍' },
            { id: 'destination', label: 'To', emoji: '✈️' },
            { id: 'visa', label: 'Visa', emoji: '📄' },
            { id: 'date', label: 'When', emoji: '📅' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition border-b-2 ${
                tab === t.id
                  ? 'border-indigo-600 text-indigo-600 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{t.emoji}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Origin Tab */}
          {tab === 'origin' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Where are you relocating from?</h3>
              <div className="grid grid-cols-2 gap-2">
                {HOME_COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => setHomeCountry(country)}
                    className={`p-3 rounded-lg border-2 text-sm font-semibold transition ${
                      homeCountry === country
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Destination Tab */}
          {tab === 'destination' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Where are you moving to?</h3>
              <div className="grid grid-cols-2 gap-2">
                {DESTINATION_COUNTRIES.map((country) => (
                  <button
                    key={country}
                    onClick={() => setDestination(country)}
                    className={`p-3 rounded-lg border-2 text-sm font-semibold transition ${
                      destination === country
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Visa Tab */}
          {tab === 'visa' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Which visa are you targeting?</h3>
              <div className="space-y-2">
                {VISA_TYPES.map((visa) => (
                  <button
                    key={visa.id}
                    onClick={() => setVisaType(visa.id)}
                    className={`w-full p-4 rounded-lg border-2 font-semibold transition text-left flex items-center gap-3 ${
                      visaType === visa.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{visa.emoji}</span>
                    <span>{visa.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Tab */}
          {tab === 'date' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">When are you planning to move?</h3>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-indigo-600 outline-none transition text-base"
              />
              <p className="text-xs text-gray-600 mt-3">
                We'll use this to customize your timeline and send you reminders.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !visaType || !destination || !homeCountry || !departureDate}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
