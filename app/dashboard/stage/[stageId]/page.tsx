'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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
  steps?: any[]
  stage_id: number
}

interface UserTask {
  id: string
  task_id: string
  status: string
}

const STAGE_EMOJIS: Record<number, string> = {
  1: '🔍',
  2: '📝',
  3: '✈️',
  4: '🎯',
  5: '🏠',
  6: '🎉',
}

export default function StagePage() {
  const params = useParams()
  const router = useRouter()
  const stageId = parseInt(params.stageId as string)

  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [stage, setStage] = useState<Stage | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [userTasks, setUserTasks] = useState<Map<string, UserTask>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
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

      const { data: stageData } = await supabase
        .from('stages')
        .select('*')
        .eq('id', stageId)
        .single()
      setStage(stageData)

      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('stage_id', stageId)
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
    }

    init()
  }, [router, stageId])

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
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stage...</p>
        </div>
      </div>
    )
  }

  if (!stage) {
    return null
  }

  // Filter tasks by visa type
  const relevantTasks = tasks.filter((t) => {
    const visaMatch = (t.visa_types as any[])?.includes(userData.visa_type) || (t.visa_types as any[])?.includes('all')
    return visaMatch
  })

  const completedCount = relevantTasks.filter((t) => userTasks.get(t.id)?.status === 'completed').length
  const progressPercent = relevantTasks.length > 0 ? Math.round((completedCount / relevantTasks.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 py-4">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm mb-3"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{STAGE_EMOJIS[stage.id]}</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {stage.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">{stage.description}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="px-4 py-6">
        {relevantTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks for this stage</p>
          </div>
        ) : (
          <div className="space-y-4">
            {relevantTasks.map((task, idx) => {
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
                  totalTasks={relevantTasks.length}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
