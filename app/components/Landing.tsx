'use client'

import { useState } from 'react'
import Link from 'next/link'

const slides = [
  {
    id: 0,
    type: 'hero',
    title: 'Move Anywhere with Confidence',
    subtitle: 'Your AI-guided companion for visa, documents, and settlement',
    highlight: 'No agents needed. Just you, Aliov, and your dream.',
  },
  {
    id: 1,
    type: 'process',
    title: 'Tell Us Your Story',
    subtitle: 'Just 2 minutes to get started',
    content: 'Email → Destination → Visa Type → Timeline',
    emoji: '📝',
  },
  {
    id: 2,
    type: 'personalization',
    title: 'We Know Where You Are',
    subtitle: 'Just starting? Already applied? Already approved?',
    content: 'We personalize your path. Start from scratch or jump to where you are.',
    emoji: '🎯',
  },
  {
    id: 3,
    type: 'dashboard',
    title: 'See Your Entire Journey',
    subtitle: 'Everything in one dashboard',
    content: '6 Stages. 60+ Tasks. Your progress. Your timeline.',
    emoji: '📊',
    stats: [
      { label: 'Current Stage', value: 'Document Prep' },
      { label: 'Progress', value: '45%' },
      { label: 'Days to Departure', value: '87' },
    ],
  },
  {
    id: 4,
    type: 'tasks',
    title: 'Step-by-Step Guidance',
    subtitle: 'No confusion. No guesswork.',
    content: 'Every task is broken into clear steps with real advice from people who have done it.',
    emoji: '📚',
    taskExample: {
      title: 'Get bank statement notarized',
      steps: [
        'Visit your bank branch',
        'Request 6 months of statements',
        'Ask for official certification',
        'Collect + scan',
      ],
    },
  },
  {
    id: 5,
    type: 'mobile',
    title: 'Track Progress Anywhere',
    subtitle: 'Your phone is your visa companion',
    content: 'Mobile-first design. Work on your visa from anywhere.',
    emoji: '📱',
  },
  {
    id: 6,
    type: 'celebration',
    title: 'Real People. Real Timelines.',
    subtitle: 'Tested with actual visa applicants',
    content: 'HPI Visa: From application to approval in 2-3 weeks with our guidance.',
    emoji: '✨',
    testimonial: {
      quote: 'I went from confused to confident in 3 weeks.',
      author: 'Chioma, HPI Visa → UK',
    },
  },
  {
    id: 7,
    type: 'cta',
    title: 'Ready?',
    subtitle: 'Let us get you moving.',
    content: 'You don\'t need an expensive agent. You need a guide who understands your journey.',
    emoji: '🚀',
  },
]

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const restart = () => {
    setCurrentSlide(0)
  }

  const slide = slides[currentSlide]

  // Hero screen
  if (!hasStarted && currentSlide === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center px-4 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 text-center max-w-2xl">
          <div className="mb-8">
            <h1 className="text-7xl font-black text-white mb-4 leading-tight">
              Move Anywhere with Confidence
            </h1>
            <p className="text-2xl text-indigo-100 mb-6 font-light">
              Your AI-guided companion for visa, documents, and settlement
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white border-opacity-20">
            <p className="text-lg text-white font-semibold mb-4">Here's how we'll guide you</p>
            <ul className="text-left space-y-3 text-indigo-100 mb-6">
              <li className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <span>Understand your visa requirements (not vague, crystal clear)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <span>Get document checklist tailored to YOU</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <span>Know exact timelines & common mistakes to avoid</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span>Track progress. Get alerts. Never miss a deadline.</span>
              </li>
            </ul>
            <p className="text-indigo-100 italic">
              Tested with real people who moved. Real timelines. Real results.
            </p>
          </div>

          <button
            onClick={() => {
              setHasStarted(true)
              setCurrentSlide(1)
            }}
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-indigo-50 transition transform hover:scale-105 shadow-lg"
          >
            See How It Works →
          </button>
        </div>
      </div>
    )
  }

  // Carousel slides
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center px-4 py-8">
      {/* Main content */}
      <div className="w-full max-w-4xl">
        {/* Slide Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 mb-8 min-h-[500px] flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="mb-8">
              {slide.emoji && <p className="text-6xl mb-4">{slide.emoji}</p>}
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                {slide.title}
              </h2>
              <p className="text-xl text-indigo-600 font-semibold mb-3">
                {slide.subtitle}
              </p>
            </div>

            {/* Hero content */}
            {slide.type === 'hero' && (
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {slide.content}
                </p>
                <p className="text-2xl font-bold text-indigo-600 italic">
                  {slide.highlight}
                </p>
              </div>
            )}

            {/* Process content */}
            {slide.type === 'process' && (
              <div className="bg-indigo-50 rounded-2xl p-6">
                <p className="text-2xl font-bold text-indigo-600 mb-4">
                  {slide.content}
                </p>
                <p className="text-gray-700">
                  No hidden questions. No lengthy forms. Just what matters.
                </p>
              </div>
            )}

            {/* Personalization content */}
            {slide.type === 'personalization' && (
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {slide.content}
                </p>
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 space-y-3">
                  <p className="text-sm font-bold text-indigo-700">
                    🔍 Researching visas?
                  </p>
                  <p className="text-sm text-gray-700 mb-3">
                    Start from Stage 1: Research & Clarity. We guide you through every requirement.
                  </p>
                  <p className="text-sm font-bold text-purple-700 mt-4">
                    ✅ Already approved?
                  </p>
                  <p className="text-sm text-gray-700">
                    Jump to Stage 4: Arrival & Settlement. We help with SIM, bank account, NHS registration.
                  </p>
                </div>
              </div>
            )}

            {/* Dashboard content */}
            {slide.type === 'dashboard' && (
              <div className="space-y-6">
                <p className="text-lg text-gray-700 mb-6">
                  {slide.content}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {slide.stats?.map((stat, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                      <p className="text-xs text-gray-600 font-semibold mb-2">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-black text-indigo-600">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks content */}
            {slide.type === 'tasks' && (
              <div className="space-y-6">
                <p className="text-lg text-gray-700 mb-6">
                  {slide.content}
                </p>
                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-indigo-200">
                  <h4 className="font-bold text-gray-900 mb-4">
                    Example: {slide.taskExample?.title}
                  </h4>
                  <div className="space-y-2">
                    {slide.taskExample?.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-gray-700 pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile content */}
            {slide.type === 'mobile' && (
              <div className="space-y-6">
                <p className="text-lg text-gray-700 mb-6">
                  {slide.content}
                </p>
                <div className="bg-gradient-to-b from-gray-900 to-gray-700 rounded-3xl p-6 inline-block w-full max-w-xs mx-auto">
                  <div className="bg-white rounded-2xl p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                    <div className="bg-indigo-600 h-10 rounded-lg mt-4"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Celebration content */}
            {slide.type === 'celebration' && (
              <div className="space-y-6">
                <p className="text-lg text-gray-700 mb-6">
                  {slide.content}
                </p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <p className="text-lg italic text-gray-900 mb-4">
                    "{slide.testimonial?.quote}"
                  </p>
                  <p className="font-semibold text-gray-700">
                    — {slide.testimonial?.author}
                  </p>
                </div>
              </div>
            )}

            {/* CTA content */}
            {slide.type === 'cta' && (
              <div className="space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {slide.content}
                </p>
                <div className="bg-indigo-100 rounded-2xl p-6 space-y-3">
                  <p className="font-bold text-indigo-900">What you get:</p>
                  <ul className="space-y-2 text-indigo-900">
                    <li className="flex items-center gap-2">
                      <span>✓</span> Complete visa roadmap for YOUR situation
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✓</span> Real timelines from real people
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✓</span> Document checklist + step-by-step guidance
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✓</span> Progress tracking + deadline alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✓</span> Avoid common mistakes
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation & Progress */}
        <div className="flex flex-col items-center gap-6">
          {/* Progress bar */}
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            ></div>
          </div>

          {/* Slide counter */}
          <p className="text-white text-sm font-semibold">
            {currentSlide + 1} / {slides.length}
          </p>

          {/* Navigation buttons */}
          {slide.type !== 'cta' ? (
            <div className="flex gap-4 w-full max-w-md">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <button
                onClick={nextSlide}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition"
              >
                Next →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full max-w-md">
              <Link
                href="/auth"
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-bold text-center transition text-lg"
              >
                Let's Get Started 🚀
              </Link>
              <button
                onClick={restart}
                className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
              >
                Watch Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}