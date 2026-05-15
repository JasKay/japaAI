'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import TaskCoach from '@/app/components/TaskCoach'
import EditProfileModal from '@/app/components/EditProfileModal'



interface Stage {
  id: number
  name: string
  description: string
  order_num: number
}

interface Task {
  id: string
  title: string
  description: string
  stage_id: number
  steps?: any[]
}

interface UserTask {
  id: string
  task_id: string
  status: string
}

const STAGE_COLORS: Record<number, { bg: string; ring: string; text: string }> = {
  1: { bg: 'bg-blue-50', ring: 'ring-blue-200', text: 'text-blue-700' },
  2: { bg: 'bg-purple-50', ring: 'ring-purple-200', text: 'text-purple-700' },
  3: { bg: 'bg-orange-50', ring: 'ring-orange-200', text: 'text-orange-700' },
  4: { bg: 'bg-green-50', ring: 'ring-green-200', text: 'text-green-700' },
  5: { bg: 'bg-emerald-50', ring: 'ring-emerald-200', text: 'text-emerald-700' },
  6: { bg: 'bg-rose-50', ring: 'ring-rose-200', text: 'text-rose-700' },
}

const STAGE_EMOJIS: Record<number, string> = {
  1: '🔍',
  2: '📝',
  3: '✈️',
  4: '🎯',
  5: '🏠',
  6: '🎉',
}

const STAGE_READINESS: Record<string, number> = {
  researching: 0,
  applying: 25,
  approved: 60,
  flight_booked: 80,
  in_uk: 100,
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [userTasks, setUserTasks] = useState<Map<string, UserTask>>(new Map())
  const [selectedStage, setSelectedStage] = useState<number | null>(null)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const router = useRouter()

  const getDepartureDateColor = () => {
  if (!userData?.expected_departure) return 'gray'
  
  const departureDate = new Date(userData.expected_departure)
  const today = new Date()
  const daysUntil = Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntil < 0) return 'red' // Past date
  if (daysUntil < 14) return 'red' // Too soon
  if (daysUntil < 30) return 'yellow' // Tight
  if (daysUntil < 90) return 'blue' // Good
  return 'green' // Plenty of time
}

const getDepartureDateWarning = () => {
  if (!userData?.expected_departure) return null
  
  const departureDate = new Date(userData.expected_departure)
  const today = new Date()
  const daysUntil = Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntil < 0) {
    return '⚠️ Your date is in the past. Something\'s wrong. Update it.'
  }
  
  if (daysUntil < 14) {
    return '⚠️ Very soon (< 2 weeks). Visa processing alone takes 3-8 weeks. Risky timeline.'
  }
  
  if (daysUntil < 30) {
    return '⚠️ Tight timeline (< 1 month). Doable but stressful. Consider pushing date.'
  }
  
  if (daysUntil < 60) {
    return '✓ Good timeline. Enough time for most visas.'
  }
  
  return '✓ Plenty of time. You\'re well-prepared.'
}

const handleRefreshUserData = async () => {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  if (data) setUserData(data)
}

const colorClass = getDepartureDateColor()
const colorMap: Record<string, string> = {
  red: 'text-red-600 bg-red-50 border-red-200',
  yellow: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  blue: 'text-blue-600 bg-blue-50 border-blue-200',
  green: 'text-green-600 bg-green-50 border-green-200',
  gray: 'text-gray-600 bg-gray-50 border-gray-200',
}

  // Helper function to get friendly status label
  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      researching: 'Researching',
      preparing: 'Preparing',
      applying: 'Applying',
      applied: 'Applied',
      approved: 'Approved ✅',
      in_country: 'In Country 🏠',
    }
    return labels[status] || 'Unknown'
  }


  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          router.push('/auth')
          return
        }
        setUser(authUser)

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (!userData) {
          router.push('/onboarding')
          return
        }

        setUserData(userData)
        setSelectedStage(1)

        const { data: stagesData } = await supabase
          .from('stages')
          .select('*')
          .order('order_num')

        setStages(stagesData || [])

        const { data: tasksData } = await supabase
          .from('tasks')
          .select('*')
          .order('stage_id')
          .order('order_num')

        setTasks(tasksData || [])

        const { data: userTasksData } = await supabase
          .from('user_tasks')
          .select('*')
          .eq('user_id', authUser.id)

        const taskMap = new Map()
        userTasksData?.forEach((ut) => {
          taskMap.set(ut.task_id, ut)
        })
        setUserTasks(taskMap)

        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'in_progress' : 'completed'
    const userTask = userTasks.get(taskId)

    try {
      if (userTask) {
        await supabase
          .from('user_tasks')
          .update({
            status: newStatus,
            completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          })
          .eq('id', userTask.id)
      } else {
        await supabase.from('user_tasks').insert([
          {
            user_id: user.id,
            task_id: taskId,
            status: newStatus,
            completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          },
        ])
      }

      const newUserTasks = new Map(userTasks)
      newUserTasks.set(taskId, {
        id: userTask?.id || taskId,
        task_id: taskId,
        status: newStatus,
      })
      setUserTasks(newUserTasks)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your plan...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  // Calculate readiness percentage
  const stageReadiness = STAGE_READINESS[userData.current_stage] || 0
  const totalTasks = tasks.length
  const completedTasks = Array.from(userTasks.values()).filter(
    (ut) => ut.status === 'completed'
  ).length
  const taskReadiness = totalTasks > 0 ? (completedTasks / totalTasks) * 30 : 0
  const readinessPercent = Math.round(stageReadiness + taskReadiness)

  // Get days until departure
  const daysUntilDeparture = Math.ceil(
    (new Date(userData.expected_departure).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  )

  // Get destination display name
  const destinationNames: Record<string, string> = {
    london: 'London',
    manchester: 'Manchester',
    birmingham: 'Birmingham',
    other: 'UK',
  }

  const destinationDisplay = destinationNames[userData.destination] || 'UK'

  // Filter tasks by visa type and stage
  const relevantTasks = tasks.filter((t) => {
    const visaMatch =
      (t.visa_types as any[])?.includes(userData.visa_type) ||
      (t.visa_types as any[])?.includes('all')
    return visaMatch
  })

  const selectedStageData = stages.find((s) => s.id === selectedStage)
  const stageTasks = relevantTasks.filter((t) => t.stage_id === selectedStage)
  const completedCount = stageTasks.filter(
    (t) => userTasks.get(t.id)?.status === 'completed'
  ).length
  const progressPercent =
    stageTasks.length > 0 ? Math.round((completedCount / stageTasks.length) * 100) : 0

  const firstName = userData?.email?.split('@')[0] || 'there'

  // Stage progress for sidebar
  const stageProgressMap: Record<number, number> = {}
  stages.forEach((stage) => {
    const stageTaskCount = relevantTasks.filter((t) => t.stage_id === stage.id).length
    const stageCompleted = relevantTasks
      .filter((t) => t.stage_id === stage.id)
      .filter((t) => userTasks.get(t.id)?.status === 'completed').length
    stageProgressMap[stage.id] = stageTaskCount > 0 ? Math.round((stageCompleted / stageTaskCount) * 100) : 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}

{/* Header - COMPACT with Edit Button */}
<div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
    {/* Mobile Header */}
    <div className="sm:hidden">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Hey {firstName}! 👋</h1>
                <button
        onClick={() => setIsEditModalOpen(true)}
        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold mt-1"
      >
        {userData?.home_country} → {destinationDisplay} | {userData?.visa_type.toUpperCase()} | {getStatusLabel(userData?.onboarding_status)} (edit)
      </button>

        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-gray-600 hover:text-gray-900"
        >
          Sign out
        </button>
      </div>

      {/* Readiness bar - mobile */}
      <div className={`border p-3 rounded-lg ${colorMap[getDepartureDateColor()]}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold">Readiness</span>
          <span className="text-sm font-bold">{readinessPercent}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-1.5">
          <div
            className="bg-indigo-600 h-1.5 rounded-full"
            style={{ width: `${readinessPercent}%` }}
          />
        </div>
        <p className="text-xs mt-2 opacity-90">{getDepartureDateWarning()}</p>
      </div>
    </div>

    {/* Desktop Header */}
    <div className="hidden sm:flex justify-between items-start mb-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hey {firstName}! 👋</h1>
                <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold mt-1"
        >
          {userData?.home_country} → {destinationDisplay} | {userData?.visa_type.toUpperCase()} | {getStatusLabel(userData?.onboarding_status)} (edit)
        </button>

      </div>
      <button
        onClick={handleSignOut}
        className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded"
      >
        Sign Out
      </button>
    </div>

    {/* Readiness Card - Desktop */}
    <div className="hidden sm:block">
      <div className={`border-2 p-4 rounded-lg ${colorMap[getDepartureDateColor()]}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs font-medium opacity-75">Readiness</p>
            <p className="text-3xl font-bold">{readinessPercent}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium opacity-75">Timeline</p>
            <p className="text-lg font-semibold">{daysUntilDeparture}d</p>
          </div>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
            style={{ width: `${readinessPercent}%` }}
          />
        </div>
        <p className="text-xs opacity-90">{getDepartureDateWarning()}</p>
      </div>
    </div>
  </div>
</div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Main Content */}
              {/* MOBILE: Only show stage buttons, NO tasks */}
      {/* MOBILE: Only show stage buttons */}
{selectedStage && (
  <div className="sm:hidden max-w-7xl mx-auto px-4 py-6">
    <h2 className="text-lg font-bold text-gray-900 mb-4">Your Journey</h2>
    <div className="grid grid-cols-2 gap-2">
      {stages.map((stage) => {
        const stageProgress = stageProgressMap[stage.id] || 0
        const previousStageId = stage.id - 1
        const previousStageProgress = previousStageId >= 1 ? stageProgressMap[previousStageId] : 100
        const isLocked = stage.id > selectedStage && previousStageProgress < 80

        return (
          <button
            key={stage.id}
            onClick={() => !isLocked && router.push(`/dashboard/stage/${stage.id}`)}
            disabled={isLocked}
            className={`p-3 rounded-lg border-2 transition text-center ${
              isLocked
                ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                : 'bg-white border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="text-2xl mb-2">{isLocked ? '🔒' : STAGE_EMOJIS[stage.id]}</div>
            <p className="text-xs font-semibold text-gray-900">{stage.name}</p>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div
                className="bg-indigo-600 h-1 rounded-full"
                style={{ width: `${stageProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{stageProgress}%</p>
          </button>
        )
      })}
    </div>
  </div>
)}


      {/* DESKTOP: Show both stages and tasks */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stage Progress Overview - GATED */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Journey</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stages.map((stage) => {
              const colors = STAGE_COLORS[stage.id]
              const isActive = selectedStage === stage.id
              const stageProgress = stageProgressMap[stage.id] || 0
              const previousStageId = stage.id - 1
              const previousStageProgress = previousStageId >= 1 ? stageProgressMap[previousStageId] : 100
              const isLocked = stage.id > selectedStage && previousStageProgress < 80
              const canUnlock = previousStageProgress >= 80

              return (
                <button
                  key={stage.id}
                  onClick={() => !isLocked && setSelectedStage(stage.id)}
                  disabled={isLocked && !canUnlock}
                  className={`p-4 rounded-xl border-2 transition ${
                    isLocked && !canUnlock
                      ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                      : isActive
                        ? `${colors.bg} border-indigo-600 ring-2 ${colors.ring}`
                        : `bg-white border-gray-200 hover:border-indigo-300`
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {isLocked && !canUnlock ? '🔒' : STAGE_EMOJIS[stage.id]}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    {stage.name}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${stageProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{stageProgress}%</p>
                  {isLocked && !canUnlock && (
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.ceil(80 - previousStageProgress)}% more
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tasks - DESKTOP ONLY */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-32">
              {selectedStageData && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedStageData.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedStageData.description}
                  </p>

                  <div className="bg-indigo-50 rounded-lg p-4 mb-4 border border-indigo-200">
                    <p className="text-xs font-medium text-indigo-700 mb-2">
                      Stage Progress
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {progressPercent}%
                    </p>
                    <div className="w-full bg-indigo-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    {completedCount} of {stageTasks.length} tasks completed
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedStageData && (
              <>
                {stageTasks.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <p className="text-lg text-gray-500">
                      No tasks for this stage in your visa category yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stageTasks.map((task, idx) => (
                      <TaskCoach
                        key={task.id}
                        task={task}
                        isCompleted={userTasks.get(task.id)?.status === 'completed'}
                        onComplete={() =>
                          handleTaskToggle(task.id, userTasks.get(task.id)?.status || 'not_started')
                        }
                        onToggle={() =>
                          handleTaskToggle(task.id, userTasks.get(task.id)?.status || 'not_started')
                        }
                        taskNumber={idx + 1}
                        totalTasks={stageTasks.length}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        userData={userData}
        userId={user?.id}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleRefreshUserData}
      />

      </div>
    </div>
  )
}
