'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [userTasks, setUserTasks] = useState<Map<string, UserTask>>(new Map())
  const [selectedStage, setSelectedStage] = useState<number | null>(null)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (userError || !userData) {
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

          console.log('Tasks Error:', tasksError)
          console.log('Tasks Data:', tasksData)
          console.log('Task Count:', tasksData?.length)


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
        console.error('Error loading dashboard:', err)
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
      console.error('Error updating task:', err)
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
          <p className="text-gray-600">Loading your journey...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    )
  }

  const selectedStageData = stages.find((s) => s.id === selectedStage)
  const stageTasks = tasks.filter((t) => t.stage_id === selectedStage)
  const completedCount = stageTasks.filter(
    (t) => userTasks.get(t.id)?.status === 'completed'
  ).length
  const progressPercent =
    stageTasks.length > 0 ? Math.round((completedCount / stageTasks.length) * 100) : 0

  const totalCompleted = Array.from(userTasks.values()).filter(
    (ut) => ut.status === 'completed'
  ).length
  const overallPercent = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0

  // Get first name for greeting
   const firstName = userData?.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Hey {firstName}! 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {userData?.visa_type.toUpperCase()} • Departing{' '}
              {new Date(userData?.expected_departure).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="hidden sm:block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            Sign Out
          </button>
          <button
            onClick={handleSignOut}
            className="sm:hidden px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            ⊗
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Overall Progress */}
        <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Overall Progress
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>
            <span className="text-lg sm:text-xl font-bold text-indigo-600 whitespace-nowrap">
              {overallPercent}%
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-3">
            {totalCompleted} of {tasks.length} tasks completed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Stage Sidebar - Mobile Drawer on small screens */}
          <div className={`lg:col-span-1 ${sidebarOpen ? 'fixed inset-0 z-40 bg-black/50' : 'hidden lg:block'}`}>
            <div className={`${sidebarOpen ? 'fixed left-0 top-0 bottom-0 w-64 bg-white overflow-y-auto pt-20' : ''} lg:relative lg:pt-0 bg-white rounded-lg shadow-sm p-4 sticky top-24 border border-gray-100`}>
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="font-semibold text-gray-900">Stages</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-2xl text-gray-400">×</button>
              </div>
              <h2 className="hidden lg:block font-semibold text-gray-900 mb-4">Stages</h2>
              <div className="space-y-2">
                {stages.map((stage) => {
                  const stageTaskCount = tasks.filter((t) => t.stage_id === stage.id).length
                  const stageCompleted = tasks
                    .filter((t) => t.stage_id === stage.id)
                    .filter((t) => userTasks.get(t.id)?.status === 'completed').length

                  return (
                    <button
                      key={stage.id}
                      onClick={() => {
                        setSelectedStage(stage.id)
                        setSidebarOpen(false)
                      }}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedStage === stage.id
                          ? 'bg-indigo-50 border-l-4 border-indigo-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-gray-900 text-sm">{stage.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {stageCompleted}/{stageTaskCount}
                        </p>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${stageTaskCount > 0 ? (stageCompleted / stageTaskCount) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Stage Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                📋 View All Stages
              </button>
            </div>

            {selectedStageData && (
              <>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 mb-6 sm:mb-8 border border-gray-100">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {selectedStageData.name}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    {selectedStageData.description}
                  </p>

                  {/* Stage Progress */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Stage Progress
                      </span>
                      <span className="text-sm sm:text-base font-bold text-indigo-600">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3 sm:space-y-4">
                  {stageTasks.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center border border-gray-100">
                      <p className="text-gray-500 text-sm sm:text-base">
                        No tasks for this stage in your visa category yet.
                      </p>
                    </div>
                  ) : (
                    stageTasks.map((task) => {
                      const userTask = userTasks.get(task.id)
                      const isCompleted = userTask?.status === 'completed'
                      const isExpanded = expandedTask === task.id

                      return (
                        <div
                          key={task.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
                        >
                          <div className="p-4 sm:p-6">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <button
                                onClick={() =>
                                  handleTaskToggle(task.id, userTask?.status || 'not_started')
                                }
                                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                                  isCompleted
                                    ? 'bg-indigo-600 border-indigo-600'
                                    : 'border-gray-300 hover:border-indigo-600'
                                }`}
                              >
                                {isCompleted && (
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </button>
                              <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                              >
                                <h3
                                  className={`text-base sm:text-lg font-semibold ${
                                    isCompleted
                                      ? 'text-gray-400 line-through'
                                      : 'text-gray-900'
                                  }`}
                                >
                                  {task.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                              </div>
                              <button
                                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-xl"
                              >
                                {isExpanded ? '−' : '+'}
                              </button>
                            </div>

                            {isExpanded && task.steps && (
                              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 ml-10">
                                <p className="font-semibold text-gray-900 text-xs sm:text-sm mb-3 sm:mb-4">
                                  Steps:
                                </p>
                                <ol className="space-y-2 sm:space-y-3">
                                  {(task.steps as any[]).map((step, idx) => (
                                    <li
                                      key={idx}
                                      className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600"
                                    >
                                      <span className="flex-shrink-0 font-semibold text-indigo-600">
                                        {idx + 1}.
                                      </span>
                                      <span>{step.text || step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
