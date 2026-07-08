import React, { useState, useEffect, useCallback } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { Plus } from 'lucide-react';
import MonthCalendar from '../../components/calendar/MonthCalendar';
import TaskCard from '../../components/tasks/TaskCard';
import TaskCardSkeleton from '../../components/ui/TaskCardSkeleton';
import TaskModal from '../../components/tasks/TaskModal';
import api from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import type { TodoTask } from '../../types/task';
import type { TodoList } from '../../types/list';

export const DayWiseView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TodoTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all tasks across all lists to filter by date
  const fetchAllTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch all user lists
      const listsResponse = await api.get<TodoList[]>(ENDPOINTS.LISTS.BASE);
      const fetchedLists = listsResponse.data;
      setLists(fetchedLists);

      // 2. Fetch tasks for each list in parallel
      const tasksPromises = fetchedLists.map((list) =>
        api.get<TodoTask[]>(ENDPOINTS.TASKS.BASE(list.id)).then((res) => res.data)
      );

      const resolvedTasksArrays = await Promise.all(tasksPromises);
      const allTasks = resolvedTasksArrays.flat();
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load tasks for day-wise view:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTasks();
  }, [fetchAllTasks]);

  // Filter tasks planned for selected date
  const filteredTasks = tasks.filter((task) => {
    if (!task.plannedDate) return false;
    return isSameDay(parseISO(task.plannedDate), selectedDate);
  });

  const streakDates = tasks
    .filter((t) => t.plannedDate)
    .map((t) => t.plannedDate as string);

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Day Wise Planner</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          Select a day in the calendar to review planned workloads.
        </p>
      </div>

      {/* Full Month Calendar View */}
      <MonthCalendar
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
        tasks={tasks}
      />

      {/* Date Header Title & Quick Add */}
      <div className="pt-2 flex items-center justify-between">
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
          Planned Tasks for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        
        {lists.length > 0 && (
          <button
            onClick={async () => {
              // Create a quick temporary task shell to open in the modal
              // The backend expects listId, so we will create it first then open modal
              setIsLoading(true);
              try {
                const listId = lists[0].id; // Default to first list
                const newTask = {
                  title: 'New Planned Task',
                  plannedDate: selectedDate.toISOString(),
                  priority: 0
                };
                const res = await api.post<TodoTask>(ENDPOINTS.TASKS.BASE(listId), newTask);
                setTasks(prev => [...prev, res.data]);
                setSelectedTask(res.data);
                setIsModalOpen(true);
              } catch (err) {
                console.error(err);
              } finally {
                setIsLoading(false);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
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

          {filteredTasks.length === 0 && (
            <div className="col-span-full py-16 text-center glass-card rounded-2xl select-none border-dashed" style={{ borderColor: 'var(--glass-border)' }}>
              <span className="text-2xl">🍃</span>
              <h4 className="font-semibold mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>No tasks scheduled</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Go to your custom lists and set planned dates on tasks to schedule them here!
              </p>
            </div>
          )}
        </div>
      )}

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

export default DayWiseView;
