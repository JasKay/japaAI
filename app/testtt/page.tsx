'use client'

import React, { useState } from 'react'

export default function NotionBuilt() {
  const [activeDb, setActiveDb] = useState('corridors')

  return (
    <div className="min-h-screen bg-white">
      {/* Notion-style Sidebar */}
      <div className="flex">
        <div className="w-64 bg-gray-900 text-white p-4 min-h-screen">
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">ALIOV</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'corridors', name: 'Visa Corridors', icon: '🗺️' },
              { id: 'tasks', name: 'Tasks', icon: '✅' },
              { id: 'stages', name: 'Stages', icon: '📊' },
              { id: 'countries', name: 'Countries', icon: '🌍' },
              { id: 'visatypes', name: 'Visa Types', icon: '📋' },
            ].map((db) => (
              <button
                key={db.id}
                onClick={() => setActiveDb(db.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  activeDb === db.id
                    ? 'bg-gray-700 text-white font-semibold'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {db.icon} {db.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* VISA CORRIDORS */}
          {activeDb === 'corridors' && (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Visa Corridors</h1>
                <p className="text-gray-600">All visa pathways and their details</p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 text-left font-semibold">Home Country</th>
                      <th className="px-4 py-3 text-left font-semibold">Destination</th>
                      <th className="px-4 py-3 text-left font-semibold">Visa Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'India → USA → F-1', home: 'India', dest: 'USA', visa: 'F-1 Student Visa', status: 'Live', date: 'May 15' },
                      { name: 'Ghana → USA → F-1', home: 'Ghana', dest: 'USA', visa: 'F-1 Student Visa', status: 'Live', date: 'May 15' },
                      { name: 'Nigeria → UK → HPI', home: 'Nigeria', dest: 'UK', visa: 'HPI Visa', status: 'Live', date: 'May 15' },
                      { name: 'France → USA → O-1', home: 'France', dest: 'USA', visa: 'O-1 Visa', status: 'Live', date: 'May 15' },
                      { name: 'Nigeria → Canada → EE', home: 'Nigeria', dest: 'Canada', visa: 'Express Entry', status: 'Live', date: 'May 15' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-blue-600">{row.name}</td>
                        <td className="px-4 py-3">{row.home}</td>
                        <td className="px-4 py-3">{row.dest}</td>
                        <td className="px-4 py-3">{row.visa}</td>
                        <td className="px-4 py-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  💡 <strong>Relations at work:</strong> Home Country and Destination link to Countries DB. Visa Type links to Visa Types DB.
                </p>
              </div>
            </div>
          )}

          {/* TASKS */}
          {activeDb === 'tasks' && (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Tasks</h1>
                <p className="text-gray-600">All tasks grouped by corridor</p>
              </div>

              {/* Grouped View */}
              <div className="space-y-6">
                {[
                  {
                    corridor: 'India → USA → F-1',
                    tasks: [
                      { stage: '1: Deciding to Move', title: 'Understand F-1 Visa & Is It Right For You?', order: 1 },
                      { stage: '1: Deciding to Move', title: 'Choose 5-10 Target Universities', order: 2 },
                      { stage: '2: Preparing Documents', title: 'Take TOEFL English Test', order: 3 },
                      { stage: '2: Preparing Documents', title: 'Gather Proof of Funds Documents', order: 4 },
                    ],
                  },
                  {
                    corridor: 'Nigeria → UK → HPI',
                    tasks: [
                      { stage: '1: Deciding to Move', title: 'Research HPI Requirements', order: 1 },
                      { stage: '2: Preparing Documents', title: 'Get UK Qualifications Assessment', order: 2 },
                    ],
                  },
                ].map((group, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-3 font-semibold text-lg">{group.corridor}</div>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-t">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Stage</th>
                          <th className="px-4 py-3 text-left font-semibold">Task Title</th>
                          <th className="px-4 py-3 text-left font-semibold">Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.tasks.map((task, j) => (
                          <tr key={j} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 text-indigo-600 font-medium">{task.stage}</td>
                            <td className="px-4 py-3">{task.title}</td>
                            <td className="px-4 py-3 text-gray-500">{task.order}/12</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  💡 <strong>Grouped by Corridor:</strong> Each task links to its Corridor and Stage. This view groups by Corridor automatically.
                </p>
              </div>
            </div>
          )}

          {/* STAGES */}
          {activeDb === 'stages' && (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Stages</h1>
                <p className="text-gray-600">The 6-stage backbone (universal for all corridors)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: 1, emoji: '🔍', name: 'Deciding to Move', desc: 'Get clear on your goals and timeline' },
                  { num: 2, emoji: '📝', name: 'Preparing Documents', desc: 'Gather everything you need for your visa' },
                  { num: 3, emoji: '✈️', name: 'Before Departure', desc: 'Final preparations before you leave' },
                  { num: 4, emoji: '🎯', name: 'First 72 Hours', desc: 'Your first days in the destination country' },
                  { num: 5, emoji: '🏠', name: 'First 30 Days', desc: 'Settling into life' },
                  { num: 6, emoji: '🎉', name: 'Settling & Thriving', desc: 'Building long-term stability' },
                ].map((stage) => (
                  <div key={stage.num} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="text-4xl mb-3">{stage.emoji}</div>
                    <p className="text-sm font-semibold text-gray-500">STAGE {stage.num}</p>
                    <h3 className="text-lg font-bold mt-1">{stage.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">{stage.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded">
                <p className="text-sm text-purple-900">
                  💡 <strong>Fixed backbone:</strong> These 6 stages never change. Every corridor uses them. Each corridor has 2 tasks per stage = 12 total.
                </p>
              </div>
            </div>
          )}

          {/* COUNTRIES */}
          {activeDb === 'countries' && (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Countries</h1>
                <p className="text-gray-600">Master reference for home countries and destinations</p>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 text-left font-semibold">Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'India', region: 'South Asia' },
                      { name: 'Ghana', region: 'West Africa' },
                      { name: 'Nigeria', region: 'West Africa' },
                      { name: 'France', region: 'Europe' },
                      { name: 'USA', region: 'North America' },
                      { name: 'Canada', region: 'North America' },
                      { name: 'UK', region: 'Europe' },
                      { name: 'Australia', region: 'Oceania' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{row.name}</td>
                        <td className="px-4 py-3 text-gray-600">{row.region}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  💡 <strong>Master reference:</strong> Add countries once here. Visa Corridors use these as dropdown options for Home Country and Destination.
                </p>
              </div>
            </div>
          )}

          {/* VISA TYPES */}
          {activeDb === 'visatypes' && (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Visa Types</h1>
                <p className="text-gray-600">Master reference for all visa categories</p>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 text-left font-semibold">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'F-1 Student Visa', cat: 'Study' },
                      { name: 'H-1B Work Visa', cat: 'Work' },
                      { name: 'O-1 Visa', cat: 'Work' },
                      { name: 'Express Entry', cat: 'Work' },
                      { name: 'HPI Visa', cat: 'Work' },
                      { name: 'Skilled Worker Visa', cat: 'Work' },
                      { name: 'Family Sponsorship', cat: 'Family' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{row.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            row.cat === 'Study' ? 'bg-blue-100 text-blue-800' :
                            row.cat === 'Work' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {row.cat}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  💡 <strong>Master reference:</strong> Add visa types once here. Visa Corridors use these as options. Scale to 400+ visa types easily.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}