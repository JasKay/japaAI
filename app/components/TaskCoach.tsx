'use client'

import { useState } from 'react'

interface Task {
  id: string
  title: string
  description: string
  stage_id: number
  order_num?: number
}

interface TaskCoachProps {
  task: Task
  isCompleted: boolean
  onComplete: () => void
  onToggle: () => void
  taskNumber: number
  totalTasks: number
}

const encouragements = [
  "You've got this! 💪",
  "Keep going, you're doing great! 🌟",
  "This is an important step. Take your time! ⏱️",
  "You're on the right path! 🎯",
  "One step at a time. You've got this! 👊",
  "Let's make it happen! 🚀",
  "You're closer than you think! 🎉",
]

export default function TaskCoach({
  task,
  isCompleted,
  onComplete,
  onToggle,
  taskNumber,
  totalTasks,
}: TaskCoachProps) {
  const [expandedTask, setExpandedTask] = useState(false)

  const getRandomEncouragement = () => {
    return encouragements[Math.floor(Math.random() * encouragements.length)]
  }

  // COLLAPSED VIEW
  if (!expandedTask) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Checkbox */}
            <button
              onClick={onToggle}
              className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                isCompleted
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'border-gray-300 hover:border-indigo-600'
              }`}
            >
              {isCompleted && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-indigo-600 mb-1">
                    Task {taskNumber}/{totalTasks}
                  </p>
                  <h3 className={`text-base sm:text-lg font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setExpandedTask(true)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-xl mt-1"
            >
              →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // EXPANDED VIEW
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border-2 border-indigo-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium opacity-90">Task {taskNumber}/{totalTasks}</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">{task.title}</h2>
          </div>
          <button
            onClick={() => setExpandedTask(false)}
            className="text-2xl hover:opacity-80 transition"
          >
            ✕
          </button>
        </div>
        <p className="text-indigo-100">{getRandomEncouragement()}</p>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        {/* Description - Main Content */}
        <div className="bg-white rounded-xl p-6 sm:p-8 mb-6 shadow-sm border border-gray-100">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {task.description}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onComplete()
              setExpandedTask(false)
            }}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition shadow-md hover:shadow-lg"
          >
            ✓ Mark Complete
          </button>
          <button
            onClick={() => setExpandedTask(false)}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-4 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}