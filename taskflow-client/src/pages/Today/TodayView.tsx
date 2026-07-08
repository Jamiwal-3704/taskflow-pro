import React, { useState, useEffect, useCallback } from 'react';
import TaskCard from '../../components/tasks/TaskCard';
import TaskCardSkeleton from '../../components/ui/TaskCardSkeleton';
import TaskModal from '../../components/tasks/TaskModal';
import api from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import type { TodoTask } from '../../types/task';
import type { TodoList } from '../../types/list';
import { isToday, parseISO } from 'date-fns';

export const TodayView: React.FC = () => {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<TodoTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultListId, setDefaultListId] = useState<string | null>(null);

  // Fetch all lists first to find default, and tasks to filter
  const fetchTodayData = useCallback(async () => {
    setIsLoading(true);
    try {
      const listsResponse = await api.get<TodoList[]>(ENDPOINTS.LISTS.BASE);
      const lists = listsResponse.data;

      // Identify default Tasks list to add quick tasks to
      const def = lists.find((l) => l.isDefault) || lists[0];
      if (def) {
        setDefaultListId(def.id);
      }

      // Fetch all tasks in parallel
      const tasksPromises = lists.map((list) =>
        api.get<TodoTask[]>(ENDPOINTS.TASKS.BASE(list.id)).then((res) => res.data)
      );

      const resolvedTasksArrays = await Promise.all(tasksPromises);
      const allTasks = resolvedTasksArrays.flat();
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load today data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayData();
  }, [fetchTodayData]);

  // Filter tasks planned or due today
  const todayTasks = tasks.filter((t) => {
    const planned = t.plannedDate ? isToday(parseISO(t.plannedDate)) : false;
    const due = t.deadline ? isToday(parseISO(t.deadline)) : false;
    // Fallback: If created today and not scheduled, show it
    const createdToday = isToday(parseISO(t.createdAt));
    return planned || due || createdToday;
  });

  const pendingTasks = todayTasks.filter((t) => t.status !== 2);
  const completedTasks = todayTasks.filter((t) => t.status === 2);

  const doneCount = completedTasks.length;
  const totalCount = todayTasks.length;
  const progressPercentage = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !defaultListId) return;

    try {
      const response = await api.post<TodoTask>(ENDPOINTS.TASKS.BASE(defaultListId), {
        title: quickTitle,
        plannedDate: new Date().toISOString(), // Plan for today by default
      });
      setTasks((prev) => [...prev, response.data]);
      setQuickTitle('');
    } catch (err) {
      console.error('Failed to quick add task:', err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: number) => {
    try {
      const response = await api.patch<TodoTask>(ENDPOINTS.TASKS.STATUS(taskId), { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...response.data } : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportantChange = async (taskId: string, isImportant: boolean) => {
    try {
      const response = await api.patch<TodoTask>(ENDPOINTS.TASKS.IMPORTANT(taskId), { isImportant });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, isImportant: response.data.isImportant } : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (taskId: string, updatedData: Partial<TodoTask>) => {
    try {
      const response = await api.put<TodoTask>(ENDPOINTS.TASKS.DETAIL(taskId), updatedData);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...response.data } : t)));
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(ENDPOINTS.TASKS.DETAIL(taskId));
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left Columns: Tasks lists */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Today's Focus</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Review schedules planned or due for today.</p>
        </div>

        {/* Quick Add Task */}
        {defaultListId && (
          <form onSubmit={handleQuickAdd} className="flex gap-3 max-w-xl">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="➕ Add a task to focus on today..."
              className="flex-1 px-4 py-2.5 rounded-xl placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none text-xs glass-input"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
            >
              Add Focus
            </button>
          </form>
        )}

        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 select-none" style={{ color: 'var(--text-muted)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
                Loading Tasks...
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <TaskCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Tasks */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 select-none" style={{ color: 'var(--text-muted)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Incomplete Tasks ({pendingTasks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onImportantChange={handleImportantChange}
                    onCardClick={(t) => {
                      setSelectedTask(t);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
              {pendingTasks.length === 0 && (
                <div className="py-10 text-center glass-card rounded-2xl select-none">
                  <span className="text-sm">🎉</span>
                  <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>No pending tasks for today!</p>
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 select-none" style={{ color: 'var(--text-muted)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Completed Today ({completedTasks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onImportantChange={handleImportantChange}
                    onCardClick={(t) => {
                      setSelectedTask(t);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Progress Circle and Tips */}
      <div className="space-y-6">
        {/* Progress Card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg border border-slate-200/5">
          <h4 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Today's Progress</h4>
          
          {/* Radial progress circle */}
          <div className="relative w-28 h-28 flex items-center justify-center mb-4">
            <svg viewBox="0 0 112 112" className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="var(--glass-border)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-blue-500 transition-all duration-500"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 * (1 - progressPercentage / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{doneCount}/{totalCount}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Done</span>
            </div>
          </div>

          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {progressPercentage === 100
              ? 'Excellent! You completed all tasks scheduled for today.'
              : `You are on track! Completed ${progressPercentage}% of today's focus.`}
          </p>
        </div>

        {/* Pro Tip Card */}
        <div className="glass-card rounded-2xl p-6 space-y-3 relative overflow-hidden shadow-lg border border-slate-200/5">
          <div className="absolute top-4 right-4 text-xl opacity-20 select-none">💡</div>
          <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Productivity Tip</h4>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Tackling your hardest or highest priority tasks first thing in the morning keeps you focused and increases overall daily output by up to 30%.
          </p>
        </div>
      </div>

      {/* Task Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={selectedTask ? tasks.find((t) => t.id === selectedTask.id) || null : null}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onCreateSubtask={async (tid, title) => {
          const res = await api.post(`/tasks/${tid}/subtasks`, { title });
          setTasks((prev) =>
            prev.map((t) => (t.id === tid ? { ...t, subTasks: [...(t.subTasks || []), res.data] } : t))
          );
        }}
        onUpdateSubtask={async (subId, payload) => {
          const res = await api.put(`/subtasks/${subId}`, payload);
          setTasks((prev) =>
            prev.map((t) => {
              if ((t.subTasks || []).some((s) => s.id === subId)) {
                return { ...t, subTasks: (t.subTasks || []).map((s) => (s.id === subId ? res.data : s)) };
              }
              return t;
            })
          );
        }}
        onDeleteSubtask={async (tid, subId) => {
          await api.delete(`/subtasks/${subId}`);
          setTasks((prev) =>
            prev.map((t) => (t.id === tid ? { ...t, subTasks: (t.subTasks || []).filter((s) => s.id !== subId) } : t))
          );
        }}
      />
    </div>
  );
};

export default TodayView;
