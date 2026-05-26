'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const slides = [
    // Slide 1: Title
    {
      bg: 'bg-gradient-to-br from-purple-700 to-indigo-600',
      content: (
        <div className="text-center text-white h-full flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">ALIOV</h1>
          <p className="text-2xl md:text-4xl font-bold mb-4">Move Anywhere with Confidence</p>
          <p className="text-lg md:text-2xl opacity-90 mb-8">No agents. No confusion. Just clarity.</p>
          <p className="text-base md:text-lg opacity-80">Relocation guidance for the 250M people who want to move</p>
        </div>
      ),
    },
    // Slide 2: Problem
    {
      bg: 'bg-gradient-to-br from-amber-100 to-orange-200',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">THE PROBLEM</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none space-y-3 text-sm md:text-base text-gray-800">
            <p className="font-semibold text-lg">250 million people want to relocate internationally.</p>
            <div>
              <p className="font-bold mb-2">They face:</p>
              <ul className="space-y-2 ml-4 list-disc">
                <li>Overwhelming complexity (15-20 steps per visa)</li>
                <li>Fragmented information (Google, YouTube, WhatsApp rumors)</li>
                <li>High cost (£500-5,000 per visa + agent fees)</li>
                <li>Long timeline (3-12 months of uncertainty)</li>
                <li>High failure rate (30-40% visa rejections)</li>
              </ul>
            </div>
            <p className="font-bold text-red-700 mt-3">Result: Most people give up or overpay for guides</p>
            <p className="font-semibold">The gap: No one is making relocation simple, structured, and affordable.</p>
          </div>
        </div>
      ),
    },
    // Slide 3: Market
    {
      bg: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">MARKET OPPORTUNITY</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none space-y-4 text-sm md:text-base">
            <div className="text-3xl md:text-4xl font-black text-purple-600">$500B+</div>
            <p className="font-semibold text-gray-900">Global migration market annually</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/80 p-4 rounded-lg border-l-4 border-indigo-600">
                <h3 className="font-bold text-gray-900 mb-2">Core Market Size</h3>
                <ul className="text-xs md:text-sm space-y-1 text-gray-700">
                  <li>• 17M+ apply for study visas yearly</li>
                  <li>• 85M+ desire skilled worker migration</li>
                  <li>• 150M+ plan relocation in 5 years</li>
                </ul>
              </div>
              <div className="bg-white/80 p-4 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-bold text-gray-900 mb-2">Our Beachhead</h3>
                <p className="text-xs md:text-sm text-gray-700"><strong>Africa → English-speaking countries</strong></p>
                <p className="text-xs md:text-sm text-gray-700">$30B serviceable market</p>
              </div>
            </div>
            
            <p className="text-xs md:text-sm text-gray-900"><strong>TAM: $400B+</strong> (Study + Skilled worker + Settlement)</p>
          </div>
        </div>
      ),
    },
    // Slide 4: Solution
    {
      bg: 'bg-gradient-to-br from-indigo-100 to-purple-200',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">THE SOLUTION</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none space-y-4 text-sm md:text-base">
            <p className="font-bold text-purple-600 text-lg">Aliov: AI-powered relocation operating system</p>
            
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between">
              <div className="bg-white/90 p-3 md:p-4 rounded-lg text-center flex-1">
                <div className="text-2xl mb-2">1️⃣</div>
                <p className="font-bold text-xs md:text-sm">INPUT</p>
                <p className="text-xs text-gray-600">Home, destination, goal</p>
              </div>
              <div className="hidden md:block text-2xl text-purple-600">→</div>
              <div className="text-xl md:hidden text-purple-600">↓</div>
              <div className="bg-white/90 p-3 md:p-4 rounded-lg text-center flex-1">
                <div className="text-2xl mb-2">2️⃣</div>
                <p className="font-bold text-xs md:text-sm">GENERATE</p>
                <p className="text-xs text-gray-600">Personalized pathway</p>
              </div>
              <div className="hidden md:block text-2xl text-purple-600">→</div>
              <div className="text-xl md:hidden text-purple-600">↓</div>
              <div className="bg-white/90 p-3 md:p-4 rounded-lg text-center flex-1">
                <div className="text-2xl mb-2">3️⃣</div>
                <p className="font-bold text-xs md:text-sm">EXECUTE</p>
                <p className="text-xs text-gray-600">Step-by-step guidance</p>
              </div>
            </div>
            
            <p className="font-bold text-purple-600 text-base md:text-lg">From "I want to move" → "Application ready"</p>
          </div>
        </div>
      ),
    },
    // Slide 5: Why Now
    {
      bg: 'bg-white',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">WHY NOW</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none grid grid-cols-1 md:grid-cols-3 gap-4 text-sm md:text-base">
            <div className="bg-white/80 border-l-4 border-purple-600 p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-2">📈 Macro</h3>
              <p className="text-xs md:text-sm text-gray-700">Post-COVID remote, climate migration, education inflation. Growth: 20% YoY</p>
            </div>
            <div className="bg-white/80 border-l-4 border-orange-500 p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-2">🤖 Tech</h3>
              <p className="text-xs md:text-sm text-gray-700">LLMs personalize workflows. Parse visa rules. Scale without humans.</p>
            </div>
            <div className="bg-white/80 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-2">🌍 Market</h3>
              <p className="text-xs md:text-sm text-gray-700">Rules change annually. Agents losing trust. DIY overwhelmed.</p>
            </div>
          </div>
          <p className="font-bold text-purple-600 text-lg mt-6">Tech ready. Market desperate. Now or never.</p>
        </div>
      ),
    },
    // Slide 6: Business Model
    {
      bg: 'bg-white',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">BUSINESS MODEL</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none space-y-4 text-sm md:text-base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">FREE Tier</h3>
                <ul className="text-xs md:text-sm space-y-1 text-gray-700">
                  <li>✓ Onboarding + pathway</li>
                  <li>✓ First 2 stages</li>
                  <li>✓ Basic checklist</li>
                </ul>
              </div>
              <div className="bg-white/80 border-l-4 border-orange-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">PREMIUM</h3>
                <ul className="text-xs md:text-sm space-y-1 text-gray-700">
                  <li>✓ Full pathway + AI</li>
                  <li>✓ Document review</li>
                  <li>✓ 24/7 support</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <p className="font-bold text-gray-900 mb-2">REVENUE MODEL:</p>
              <p className="text-xs md:text-sm text-gray-700 mb-2">1M users × 20% Premium × $25/mo</p>
              <p className="text-2xl md:text-3xl font-black text-purple-600">= $60M ARR</p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 7: Product
    {
      bg: 'bg-gradient-to-br from-green-100 to-emerald-200',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">PRODUCT: MVP LIVE</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none space-y-4 text-sm md:text-base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 border-l-4 border-green-600 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">✅ Built & Live</h3>
                <ul className="text-xs md:text-sm space-y-1 text-gray-700">
                  <li>3 visa types (HPI, Study, Skilled Worker)</li>
                  <li>6-stage framework</li>
                  <li>10 countries, 5 destinations</li>
                  <li>Mobile-responsive</li>
                </ul>
              </div>
              <div className="bg-white/80 border-l-4 border-amber-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-2">🔄 In Progress</h3>
                <ul className="text-xs md:text-sm space-y-1 text-gray-700">
                  <li>AI copilot</li>
                  <li>4 additional visas</li>
                  <li>Document verification</li>
                  <li>Smart timeline</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="font-bold text-xs md:text-sm text-gray-900 mb-2">User feedback:</p>
              <p className="text-xs text-gray-700 italic">"Saved me 3 months of googling" — Nigeria</p>
              <p className="text-xs text-gray-700 italic mt-1">"Finally the REAL timeline" — Ghana</p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 8: Competitive Advantage
    {
      bg: 'bg-white',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">WHY ALIOV WINS</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none text-xs md:text-sm">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left font-bold text-gray-900">Factor</th>
                  <th className="p-2 text-left font-bold text-gray-900">Google</th>
                  <th className="p-2 text-left font-bold text-gray-900">Agents</th>
                  <th className="p-2 text-left font-bold text-gray-900">Forums</th>
                  <th className="p-2 text-left font-bold bg-purple-100 text-purple-900">Aliov</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-bold">Cost</td>
                  <td className="p-2">Free</td>
                  <td className="p-2">$1-5K</td>
                  <td className="p-2">Free</td>
                  <td className="p-2 bg-green-50 text-green-700 font-bold">$10-50/mo</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold">Personalized</td>
                  <td className="p-2">❌</td>
                  <td className="p-2">✓</td>
                  <td className="p-2">❌</td>
                  <td className="p-2 bg-green-50 text-green-700 font-bold">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold">24/7</td>
                  <td className="p-2">✓</td>
                  <td className="p-2">❌</td>
                  <td className="p-2">✓</td>
                  <td className="p-2 bg-green-50 text-green-700 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Always Updated</td>
                  <td className="p-2">❌</td>
                  <td className="p-2">❌</td>
                  <td className="p-2">❌</td>
                  <td className="p-2 bg-green-50 text-green-700 font-bold">✓</td>
                </tr>
              </tbody>
            </table>
            <p className="font-bold text-purple-600 mt-4">We replace the research phase (most time-consuming part)</p>
          </div>
        </div>
      ),
    },
    // Slide 9: GTM
    {
      bg: 'bg-white',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">GO-TO-MARKET</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none space-y-4 text-sm md:text-base">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/80 border-l-4 border-purple-600 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Phase 1</h3>
                <p className="text-xs md:text-sm text-gray-700"><strong>Nigeria → UK</strong></p>
                <p className="text-xs text-gray-600">Direct acquisition</p>
                <p className="text-xs font-bold text-gray-700">Goal: 10K users</p>
              </div>
              <div className="bg-white/80 border-l-4 border-orange-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Phase 2</h3>
                <p className="text-xs md:text-sm text-gray-700"><strong>Expand corridors</strong></p>
                <p className="text-xs text-gray-600">Ghana, Kenya, India</p>
                <p className="text-xs font-bold text-gray-700">Goal: 100K users</p>
              </div>
              <div className="bg-white/80 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-bold text-gray-900 mb-1">Phase 3</h3>
                <p className="text-xs md:text-sm text-gray-700"><strong>Partnerships</strong></p>
                <p className="text-xs text-gray-600">Universities, job boards</p>
                <p className="text-xs font-bold text-gray-700">Goal: 500K users</p>
              </div>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
              <p className="font-bold text-xs md:text-sm text-gray-900">Acquisition mix (CAC: $25):</p>
              <p className="text-xs md:text-sm text-gray-700 mt-1">50% Organic | 30% Partnerships | 20% Paid ads</p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 10: Financials
    {
      bg: 'bg-white',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">FINANCIAL PROJECTIONS</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none space-y-4 text-sm md:text-base">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl md:text-3xl font-black text-green-600 mb-2">Year 1</div>
                <p className="text-xs md:text-sm font-bold text-gray-900">50K users</p>
                <p className="text-xl md:text-2xl font-black text-green-600">$1.2M</p>
                <p className="text-xs text-gray-600">10% conversion</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl md:text-3xl font-black text-blue-600 mb-2">Year 2</div>
                <p className="text-xs md:text-sm font-bold text-gray-900">250K users</p>
                <p className="text-xl md:text-2xl font-black text-blue-600">$11.25M</p>
                <p className="text-xs text-gray-600">15% conversion</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="text-2xl md:text-3xl font-black text-orange-600 mb-2">Year 3</div>
                <p className="text-xs md:text-sm font-bold text-gray-900">1M users</p>
                <p className="text-xl md:text-2xl font-black text-orange-600">$54M</p>
                <p className="text-xs text-gray-600">18% conversion</p>
              </div>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
              <p className="font-bold text-xs md:text-sm text-gray-900">Key metrics:</p>
              <p className="text-xs md:text-sm text-gray-700 mt-1">Gross margins: <strong>85%+</strong> | Payback: <strong>3 months</strong> | Profitable: <strong>Month 18</strong></p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 11: Moat
    {
      bg: 'bg-white',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">WHY WE'RE DEFENSIBLE</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="bg-white/80 border-l-4 border-purple-600 p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-2">📊 Data Network Effects</h3>
              <p className="text-gray-700">100K users = 5M+ data points. Learn what works. Predict failures.</p>
            </div>
            <div className="bg-white/80 border-l-4 border-orange-500 p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-2">🎯 Country Expertise</h3>
              <p className="text-gray-700">Deep knowledge per corridor. Continuously improving. Always ahead.</p>
            </div>
            <div className="bg-white/80 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-2">🤖 AI Personalization</h3>
              <p className="text-gray-700">Every interaction trains model. Proprietary insights. Switching cost increases.</p>
            </div>
            <div className="bg-white/80 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-2">👥 Community Trust</h3>
              <p className="text-gray-700">Brand becomes synonymous with relocation. 100K success stories.</p>
            </div>
          </div>
          <p className="font-bold text-purple-600 text-base md:text-lg mt-4">By Year 3: The relocation intelligence system</p>
        </div>
      ),
    },
    // Slide 12: Use of Funds
    {
      bg: 'bg-white',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">$1M SEED ALLOCATION</h2>
          <div className="overflow-y-auto max-h-[70vh] md:max-h-none space-y-4 text-sm md:text-base">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                <div className="text-3xl md:text-4xl font-black text-purple-600 mb-2">50%</div>
                <p className="font-bold text-gray-900 text-xs md:text-sm">Product</p>
                <p className="text-xs text-gray-600">$500K</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
                <div className="text-3xl md:text-4xl font-black text-orange-600 mb-2">30%</div>
                <p className="font-bold text-gray-900 text-xs md:text-sm">Marketing</p>
                <p className="text-xs text-gray-600">$300K</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <div className="text-3xl md:text-4xl font-black text-green-600 mb-2">20%</div>
                <p className="font-bold text-gray-900 text-xs md:text-sm">Operations</p>
                <p className="text-xs text-gray-600">$200K</p>
              </div>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
              <p className="font-bold text-xs md:text-sm text-gray-900 mb-1">Hiring (Year 1):</p>
              <p className="text-xs md:text-sm text-gray-700">2 Engineers + 1 PM + 1 Writer + 1 Customer Success</p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 13: Closing
    {
      bg: 'bg-gradient-to-br from-red-500 to-pink-500',
      content: (
        <div className="text-center text-white h-full flex flex-col justify-center items-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">THE OPPORTUNITY</h2>
          <p className="text-base md:text-lg mb-6 leading-relaxed">
            250 million people want to relocate.<br/>
            Most never will because the system is too broken.
          </p>
          <p className="text-lg md:text-2xl font-bold mb-8 leading-relaxed">
            Aliov is the infrastructure layer<br/>
            that makes relocation possible.
          </p>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg mb-6 max-w-sm">
            <p className="font-bold text-base mb-2">THE ASK: $1M</p>
            <p className="text-sm opacity-90">Scale to 250K users, build AI copilot, reach profitability</p>
          </div>
          <p className="text-xs md:text-sm opacity-85">
            $30B+ market | Network effects | Data moat | $1B+ company
          </p>
        </div>
      ),
    },
    // Slide 14: Thank You
    {
      bg: 'bg-gradient-to-br from-purple-700 to-indigo-600',
      content: (
        <div className="text-center text-white h-full flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">ALIOV</h1>
          <p className="text-lg md:text-2xl font-bold mb-12">Move Anywhere with Confidence</p>
          <div className="space-y-2 text-sm md:text-base">
            <p>hello@aliov.com</p>
            <p>aliov.com</p>
            <p className="text-xs opacity-70 mt-6">Let's make global relocation simple</p>
          </div>
        </div>
      ),
    },
  ]

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlide])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Slide Container */}
      <div className="w-full max-w-6xl">
        <div className={`${slides[currentSlide].bg} rounded-lg shadow-2xl aspect-video flex items-center justify-center overflow-hidden`}>
          <div className="w-full h-full p-6 md:p-12 flex items-center justify-center">
            {slides[currentSlide].content}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition transform hover:scale-105 active:scale-95"
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition transform hover:scale-105 active:scale-95"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="mt-6 text-white text-center font-semibold">
        <p className="text-lg">
          <span className="text-indigo-400">{currentSlide + 1}</span> / <span className="text-gray-400">{slides.length}</span>
        </p>
      </div>

      {/* Mobile Indicator */}
      {isMobile && (
        <p className="text-gray-400 text-xs mt-4 text-center">
          💡 Use arrow buttons or ← → arrow keys to navigate
        </p>
      )}
    </div>
  )
}