import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useTasks from '../../hooks/useTasks';
import TaskCard from '../../components/tasks/TaskCard';
import TaskCardSkeleton from '../../components/ui/TaskCardSkeleton';
import TaskModal from '../../components/tasks/TaskModal';
import type { TodoTask } from '../../types/task';

export const ListPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const {
    tasks,
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    patchTaskStatus,
    patchTaskImportance,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask,
  } = useTasks(listId);

  const [viewType, setViewType] = useState<number>(0); // 0 = List, 1 = Board
  const [quickTitle, setQuickTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<TodoTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mobile/Touch Drag and Drop states for Kanban columns
  const [touchDragTaskId, setTouchDragTaskId] = useState<string | null>(null);
  const [touchOverColumn, setTouchOverColumn] = useState<number | null>(null);

  // Prevent default scroll behavior when actively dragging on touch devices
  useEffect(() => {
    if (!touchDragTaskId) return;

    const preventDefault = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };

    window.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      window.removeEventListener('touchmove', preventDefault);
    };
  }, [touchDragTaskId]);

  const handleTouchStart = (taskId: string, e: React.TouchEvent) => {
    // Start a 250ms long-press timer to initiate dragging
    const timer = setTimeout(() => {
      setTouchDragTaskId(taskId);
      if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback feedback
    }, 250);

    // Save timer directly to target DOM element to cancel it later
    (e.target as any)._dragTimer = timer;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragTaskId) {
      // If user moves before 250ms, cancel the long-press to allow normal page scrolling
      const timer = (e.target as any)._dragTimer;
      if (timer) clearTimeout(timer);
      return;
    }

    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!elem) return;

    // Search for nearest column element containing data-column-status
    const columnElem = elem.closest('[data-column-status]');
    if (columnElem) {
      const statusVal = Number(columnElem.getAttribute('data-column-status'));
      setTouchOverColumn(statusVal);
    } else {
      setTouchOverColumn(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Clean up any remaining long-press timer
    const timer = (e.target as any)._dragTimer;
    if (timer) clearTimeout(timer);

    if (!touchDragTaskId) return;

    if (touchOverColumn !== null) {
      const task = tasks.find((t) => t.id === touchDragTaskId);
      if (task && task.status !== touchOverColumn) {
        patchTaskStatus(touchDragTaskId, touchOverColumn);
      }
    }

    // Reset touch drag states
    setTouchDragTaskId(null);
    setTouchOverColumn(null);
  };

  useEffect(() => {
    if (listId) {
      fetchTasks();
    }
  }, [listId, fetchTasks]);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      await createTask(quickTitle);
      setQuickTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardClick = (task: TodoTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Synchronize modal task detail references on updates
  const activeModalTask = selectedTask
    ? tasks.find((t) => t.id === selectedTask.id) || null
    : null;

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500/50', 'bg-blue-900/10');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-blue-500/50', 'bg-blue-900/10');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500/50', 'bg-blue-900/10');
    
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== newStatus) {
        patchTaskStatus(taskId, newStatus);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/10 dark:border-slate-850 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Tasks Workspace</h2>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Manage, status, and track completion intervals.</p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1 glass-panel bg-slate-950/20 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewType(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              viewType === 0 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-slate-450 dark:hover:text-slate-200'
            }`}
          >
            📋 List View
          </button>
          <button
            onClick={() => setViewType(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              viewType === 1 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:text-slate-450 dark:hover:text-slate-200'
            }`}
          >
            📊 Board Kanban
          </button>
        </div>
      </div>

      {/* Quick Add Inline Form */}
      <form onSubmit={handleQuickAdd} className="flex gap-3 max-w-xl">
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="➕ Quick add a new task... (Press Enter)"
          className="flex-1 px-4 py-2.5 rounded-xl placeholder-slate-450 focus:outline-none text-xs glass-input"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
        >
          Add Task
        </button>
      </form>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* List Layout (ViewType = 0) */}
          {viewType === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={patchTaskStatus}
                  onImportantChange={patchTaskImportance}
                  onCardClick={handleCardClick}
                />
              ))}

              {tasks.length === 0 && (
                <div className="col-span-full py-16 text-center glass-card border-dashed border-slate-350/20 dark:border-slate-850 rounded-2xl select-none">
                  <span className="text-2xl">💤</span>
                  <h4 className="font-semibold text-slate-500 dark:text-slate-400 mt-2 text-xs">No tasks found</h4>
                  <p className="text-slate-450 dark:text-slate-600 text-[10px] mt-1">Use the quick add bar above to create your first task!</p>
                </div>
              )}
            </div>
          )}

          {/* Kanban Board Layout (ViewType = 1) */}
          {viewType === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-2">
              {/* Column 1: To Do */}
              <div
                data-column-status={0}
                className={`glass-panel p-4 space-y-4 rounded-2xl border transition-all duration-300 ${
                  touchOverColumn === 0 ? 'border-blue-500/50 bg-blue-900/10 scale-[1.01]' : 'border-slate-200/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 0)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-250/25 dark:border-slate-850">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    To Do
                  </h4>
                  <span className="bg-slate-200/60 dark:bg-slate-800 text-slate-650 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tasks.filter((t) => t.status === 0).length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[100px]">
                  {tasks.filter((t) => t.status === 0).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={patchTaskStatus}
                      onImportantChange={patchTaskImportance}
                      onCardClick={handleCardClick}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onTouchStart={(e) => handleTouchStart(task.id, e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      isTouchDragging={touchDragTaskId === task.id}
                    />
                  ))}
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div
                data-column-status={1}
                className={`glass-panel p-4 space-y-4 rounded-2xl border transition-all duration-300 ${
                  touchOverColumn === 1 ? 'border-blue-500/50 bg-blue-900/10 scale-[1.01]' : 'border-slate-200/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 1)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-250/25 dark:border-slate-850">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-450 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                    In Progress
                  </h4>
                  <span className="bg-slate-200/60 dark:bg-slate-800 text-slate-650 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tasks.filter((t) => t.status === 1).length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[100px]">
                  {tasks.filter((t) => t.status === 1).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={patchTaskStatus}
                      onImportantChange={patchTaskImportance}
                      onCardClick={handleCardClick}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onTouchStart={(e) => handleTouchStart(task.id, e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      isTouchDragging={touchDragTaskId === task.id}
                    />
                  ))}
                </div>
              </div>

              {/* Column 3: Complete */}
              <div
                data-column-status={2}
                className={`glass-panel p-4 space-y-4 rounded-2xl border transition-all duration-300 ${
                  touchOverColumn === 2 ? 'border-blue-500/50 bg-blue-900/10 scale-[1.01]' : 'border-slate-200/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 2)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-250/25 dark:border-slate-850">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Complete
                  </h4>
                  <span className="bg-slate-200/60 dark:bg-slate-800 text-slate-650 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {tasks.filter((t) => t.status === 2).length}
                  </span>
                </div>
                <div className="space-y-3 min-h-[100px]">
                  {tasks.filter((t) => t.status === 2).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={patchTaskStatus}
                      onImportantChange={patchTaskImportance}
                      onCardClick={handleCardClick}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onTouchStart={(e) => handleTouchStart(task.id, e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      isTouchDragging={touchDragTaskId === task.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Task Details Dialog Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={activeModalTask}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onCreateSubtask={createSubTask}
        onUpdateSubtask={updateSubTask}
        onDeleteSubtask={deleteSubTask}
      />
    </div>
  );
};

export default ListPage;
