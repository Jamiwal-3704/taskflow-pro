import React, { useState, useEffect, useCallback } from 'react';
import TaskCard from '../../components/tasks/TaskCard';
import TaskCardSkeleton from '../../components/ui/TaskCardSkeleton';
import TaskModal from '../../components/tasks/TaskModal';
import api from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import type { TodoTask } from '../../types/task';

export const ImportantView: React.FC = () => {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TodoTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchImportantTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch important tasks from API
      const responseList = await api.get<TodoTask[]>(ENDPOINTS.TASKS.ALL_IMPORTANT);
      setTasks(responseList.data);
    } catch (error) {
      console.error('Failed to load important tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImportantTasks();
  }, [fetchImportantTasks]);

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
      // Toggle off important
      await api.patch<TodoTask>(ENDPOINTS.TASKS.IMPORTANT(taskId), { isImportant });
      // Remove task from list since we are in the Important View!
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
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
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span className="text-amber-400">★</span> Important Tasks
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          Review all starred tasks aggregated across all lists.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
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

          {tasks.length === 0 && (
            <div className="col-span-full py-16 text-center glass-card rounded-2xl select-none border-dashed" style={{ borderColor: 'var(--glass-border)' }}>
              <span className="text-xl text-amber-400">★</span>
              <h4 className="font-semibold mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>No important tasks</h4>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Star tasks inside custom lists to pin them in this global view!
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

export default ImportantView;
