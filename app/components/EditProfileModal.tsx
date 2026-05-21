'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { X } from 'lucide-react'

// VISA TYPES BY DESTINATION
const VISA_BY_DESTINATION: Record<string, Array<{ id: string; label: string; emoji: string }>> = {
  uk: [
    { id: 'hpi', label: 'HPI Visa (Fresh Grad)', emoji: '🌟' },
    { id: 'study', label: 'Study Visa', emoji: '🎓' },
    { id: 'work_uk', label: 'Skilled Worker', emoji: '💼' },
  ],
  usa: [
    { id: 'h1b', label: 'H-1B Work Visa', emoji: '💼' },
    { id: 'study_usa', label: 'F-1 Student Visa', emoji: '🎓' },
    { id: 'eb5_investment', label: 'EB-5 Investment', emoji: '💰' },
  ],
  canada: [
    { id: 'express_entry', label: 'Express Entry', emoji: '🍁' },
    { id: 'study_canada', label: 'Study Permit', emoji: '🎓' },
    { id: 'lmia_work', label: 'Work Permit (LMIA)', emoji: '💼' },
  ],
  australia: [
    { id: 'skilled_australia', label: 'Skilled Migration', emoji: '🦘' },
    { id: 'study_australia', label: 'Student Visa', emoji: '🎓' },
    { id: 'work_australia', label: 'Work Visa (482)', emoji: '💼' },
  ],
  germany: [
    { id: 'blue_card', label: 'EU Blue Card', emoji: '🇪🇺' },
    { id: 'study_germany', label: 'Student Visa', emoji: '🎓' },
    { id: 'work_germany', label: 'Work Visa', emoji: '💼' },
  ],
}

const DESTINATIONS = ['UK', 'USA', 'Canada', 'Australia', 'Germany']

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentData: {
    home_country: string
    destination: string
    visa_type: string
    destination_city: string
    expected_departure: string
  }
  onSave: (data: any) => Promise<void>
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentData,
  onSave,
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState('from')
  const [homeCountry, setHomeCountry] = useState(currentData.home_country)
  const [destination, setDestination] = useState(currentData.destination)
  const [visaType, setVisaType] = useState(currentData.visa_type)
  const [city, setCity] = useState(currentData.destination_city)
  const [departureDate, setDepartureDate] = useState(currentData.expected_departure)
  const [loading, setLoading] = useState(false)

  // Get visa types for selected destination
  const visasForDestination = VISA_BY_DESTINATION[destination.toLowerCase()] || []

  // Reset visa type when destination changes
  useEffect(() => {
    setVisaType('')
  }, [destination])

  const handleSave = async () => {
    if (!homeCountry || !destination || !visaType || !city || !departureDate) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      await onSave({
        home_country: homeCountry,
        destination: destination.toLowerCase(),
        visa_type: visaType,
        destination_city: city.toLowerCase(),
        expected_departure: departureDate,
      })
      onClose()
    } catch (err) {
      alert('Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-6">
          {[
            { id: 'from', label: 'From (Origin)', icon: '🏠' },
            { id: 'to', label: 'To (Destination)', icon: '✈️' },
            { id: 'visa', label: 'Visa', icon: '📋' },
            { id: 'when', label: 'When', icon: '📅' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* FROM TAB */}
          {activeTab === 'from' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Where are you from?</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Nigeria', 'Ghana', 'Kenya', 'South Africa',
                  'India', 'Pakistan', 'Bangladesh',
                  'Mexico', 'Brazil', 'Philippines'
                ].map((country) => (
                  <button
                    key={country}
                    onClick={() => setHomeCountry(country)}
                    className={`p-3 rounded-lg border-2 font-semibold transition text-sm ${
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

          {/* TO TAB */}
          {activeTab === 'to' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Where are you moving to?</h3>
              <div className="grid grid-cols-2 gap-3">
                {DESTINATIONS.map((country) => (
                  <button
                    key={country}
                    onClick={() => setDestination(country)}
                    className={`p-3 rounded-lg border-2 font-semibold transition text-sm ${
                      destination === country
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

          {/* VISA TAB - NOW FILTERED BY DESTINATION */}
          {activeTab === 'visa' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Visa Type for {destination}</h3>
              {visasForDestination.length > 0 ? (
                <div className="space-y-3">
                  {visasForDestination.map((visa) => (
                    <button
                      key={visa.id}
                      onClick={() => setVisaType(visa.id)}
                      className={`w-full p-4 rounded-lg border-2 transition text-left flex items-center gap-3 ${
                        visaType === visa.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-2xl">{visa.emoji}</span>
                      <span className={`font-semibold ${visaType === visa.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                        {visa.label}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Please select a destination first</p>
              )}

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City in {destination}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={`e.g., London`}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none"
                />
              </div>
            </div>
          )}

          {/* WHEN TAB */}
          {activeTab === 'when' && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">When are you leaving?</h3>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none text-base"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}