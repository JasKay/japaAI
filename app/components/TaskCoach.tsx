'use client'

import { useState } from 'react'

interface Step {
  step?: number
  text?: string
  title?: string
  description?: string
  guidance?: string
  tip?: string
  actions?: string[]
}

interface Task {
  id: string
  title: string
  description: string
  steps?: Step[]
  stage_id: number
}

interface TaskCoachProps {
  task: Task
  isCompleted: boolean
  onComplete: () => void
  onToggle: () => void
  taskNumber: number
  totalTasks: number
}

const ENCOURAGEMENTS = [
  "You've got this! 💪",
  "This is easier than you think ✨",
  "You're doing amazing! 🌟",
  "One step at a time 👣",
  "You're stronger than you know 💫",
  "This won't take long ⚡",
]

const getRandomEncouragement = () => {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
}

export default function TaskCoach({
  task,
  isCompleted,
  onComplete,
  onToggle,
  taskNumber,
  totalTasks,
}: TaskCoachProps) {
  const [expandedTask, setExpandedTask] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = (task.steps as Step[]) || []
  const totalSteps = steps.length

  const handleCompleteStep = (stepNum: number) => {
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps([...completedSteps, stepNum])
    }
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCompleteTask = () => {
    setExpandedTask(false)
    setCurrentStep(1)
    setCompletedSteps([])
    onComplete()
  }

  const currentStepData = steps[currentStep - 1]
  const stepText = currentStepData?.title || currentStepData?.text || ''
  const stepDescription = currentStepData?.description || ''
  const guidance = currentStepData?.guidance || ''
  const tip = currentStepData?.tip || ''
  const actions = currentStepData?.actions || []

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
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
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

  // EXPANDED GUIDED VIEW
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
            className="text-2xl hover:opacity-80"
          >
            ✕
          </button>
        </div>
        <p className="text-indigo-100">{getRandomEncouragement()}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-900">
            Step {currentStep}/{totalSteps}
          </span>
          <span className="text-sm font-semibold text-indigo-600">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <div className="bg-white rounded-xl p-6 mb-6">
          {/* Step Title/Question */}
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            📌 {stepText}
          </h3>

          {stepDescription && (
            <p className="text-gray-700 mb-4">{stepDescription}</p>
          )}

          {/* Guidance Box */}
          {guidance && (
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-4 rounded">
              <p className="text-sm text-indigo-900">
                <span className="font-semibold">Here's how:</span> {guidance}
              </p>
            </div>
          )}

          {/* Pro Tip */}
          {tip && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs sm:text-sm text-amber-900">
                <span className="font-semibold">💡 Pro tip:</span> {tip}
              </p>
            </div>
          )}

          {/* Action Buttons (Check-ins) */}
          {actions && actions.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">How are you doing?</p>
              <div className="grid grid-cols-2 gap-2">
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCompleteStep(currentStep)}
                    className="px-3 py-2 text-xs sm:text-sm bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-lg border border-gray-300 hover:border-indigo-300 transition"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition"
            >
              ← Back
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              onClick={handleNextStep}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleCompleteTask}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              ✅ Mark Complete
            </button>
          )}
        </div>

        {/* Completion Celebration */}
        {currentStep === totalSteps && (
          <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-lg font-bold text-green-900 mb-2">You're ready!</p>
            <p className="text-sm text-green-700">
              You have completed all steps for this task. Mark it complete and move to the next one.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
