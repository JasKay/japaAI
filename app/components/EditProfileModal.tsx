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

  const handleSave = async () => {
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
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Home Country */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Where are you from?
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {HOME_COUNTRIES.map((country) => (
              <button
                key={country}
                onClick={() => setHomeCountry(country)}
                className={`p-2 rounded-lg border-2 text-xs font-semibold transition ${
                  homeCountry === country
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* Destination */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Where are you going?
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {DESTINATION_COUNTRIES.map((country) => (
              <button
                key={country}
                onClick={() => setDestination(country)}
                className={`p-2 rounded-lg border-2 text-xs font-semibold transition ${
                  destination === country
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* Visa Type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Visa Type
          </label>
          <div className="space-y-2">
            {VISA_TYPES.map((visa) => (
              <button
                key={visa.id}
                onClick={() => setVisaType(visa.id)}
                className={`w-full p-3 rounded-lg border-2 font-semibold transition text-left flex items-center gap-2 text-sm ${
                  visaType === visa.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 text-gray-900'
                }`}
              >
                <span>{visa.emoji}</span>
                <span>{visa.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Departure Date */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Expected Departure Date
          </label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none transition text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50 text-sm"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
