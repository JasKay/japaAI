'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import TaskCoach from '@/app/components/TaskCoach'


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
  const router = useRouter()

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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Hey {firstName}! 👋
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                {userData?.visa_type.toUpperCase()} | {destinationDisplay} 🇬🇧 | {daysUntilDeparture} days to go
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>

          {/* Readiness Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Readiness</p>
                <p className="text-4xl font-bold text-indigo-600 mt-1">{readinessPercent}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {completedTasks}/{totalTasks} tasks
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>

            <p className="text-xs text-gray-600 mt-3">
              {readinessPercent < 50 && '🚀 Keep building momentum!'}
              {readinessPercent >= 50 && readinessPercent < 80 && '⚡ You\'re on track!'}
              {readinessPercent >= 80 && '🎉 Almost ready!'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stage Progress Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Journey</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stages.map((stage) => {
              const colors = STAGE_COLORS[stage.id]
              const isActive = selectedStage === stage.id
              const stageProgress = stageProgressMap[stage.id] || 0

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`p-4 rounded-xl border-2 transition ${
                    isActive
                      ? `${colors.bg} border-indigo-600 ring-2 ${colors.ring}`
                      : `bg-white border-gray-200 hover:border-indigo-300`
                  }`}
                >
                  <div className="text-2xl mb-2">{STAGE_EMOJIS[stage.id]}</div>
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    Stage {stage.id}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${stageProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{stageProgress}%</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stage Details */}
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

          {/* Main Tasks Area */}
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
                    {stageTasks.map((task, idx) => {
  const userTask = userTasks.get(task.id)
  const isCompleted = userTask?.status === 'completed'

  return (
    <TaskCoach
      key={task.id}
      task={task}
      isCompleted={isCompleted}
      onComplete={() =>
        handleTaskToggle(task.id, userTask?.status || 'not_started')
      }
      onToggle={() =>
        handleTaskToggle(task.id, userTask?.status || 'not_started')
      }
      taskNumber={idx + 1}
      totalTasks={stageTasks.length}
    />
  )
})}

                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
