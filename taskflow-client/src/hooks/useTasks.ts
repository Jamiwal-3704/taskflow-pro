import { useState, useCallback } from 'react';
import api from '../api/axios';
import ENDPOINTS from '../api/endpoints';
import type { TodoTask, TodoSubtask } from '../types/task';

export const useTasks = (listId?: string) => {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!listId) return;
    setIsLoading(true);
    try {
      const response = await api.get<TodoTask[]>(ENDPOINTS.TASKS.BASE(listId));
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  const createTask = async (title: string, description?: string, priority = 0, deadline?: string, plannedDate?: string) => {
    if (!listId) return;

    // Edge-case validations
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length === 0) {
      throw new Error('Task title cannot be empty.');
    }
    if (trimmedTitle.length > 100) {
      throw new Error('Task title cannot exceed 100 characters.');
    }
    if (description && description.length > 2000) {
      throw new Error('Task description cannot exceed 2000 characters.');
    }
    if (priority < 0 || priority > 4) {
      throw new Error('Priority must be between 0 (None) and 4 (Critical).');
    }

    try {
      const response = await api.post<TodoTask>(ENDPOINTS.TASKS.BASE(listId), {
        title: trimmedTitle,
        description,
        priority,
        deadline,
        plannedDate,
      });
      setTasks((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updatedData: Partial<TodoTask>) => {
    // Edge-case validations
    if (updatedData.title !== undefined) {
      const trimmed = updatedData.title.trim();
      if (!trimmed || trimmed.length === 0) {
        throw new Error('Task title cannot be empty.');
      }
      if (trimmed.length > 100) {
        throw new Error('Task title cannot exceed 100 characters.');
      }
      updatedData = { ...updatedData, title: trimmed };
    }
    if (updatedData.description !== undefined && updatedData.description !== null && updatedData.description.length > 2000) {
      throw new Error('Task description cannot exceed 2000 characters.');
    }

    try {
      const response = await api.put<TodoTask>(ENDPOINTS.TASKS.DETAIL(taskId), updatedData);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...response.data } : t)));
      return response.data;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const patchTaskStatus = async (taskId: string, status: number) => {
    if (status < 0 || status > 2) {
      throw new Error('Status must be 0 (Pending), 1 (Working), or 2 (Complete).');
    }

    try {
      const response = await api.patch<TodoTask>(ENDPOINTS.TASKS.STATUS(taskId), { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...response.data } : t)));
      return response.data;
    } catch (error) {
      console.error('Failed to patch task status:', error);
      throw error;
    }
  };

  const patchTaskImportance = async (taskId: string, isImportant: boolean) => {
    try {
      const response = await api.patch<TodoTask>(ENDPOINTS.TASKS.IMPORTANT(taskId), { isImportant });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, isImportant: response.data.isImportant } : t)));
      return response.data;
    } catch (error) {
      console.error('Failed to patch task importance:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(ENDPOINTS.TASKS.DETAIL(taskId));
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  // Subtask Helpers
  const createSubTask = async (taskId: string, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length === 0) {
      throw new Error('Subtask title cannot be empty.');
    }
    if (trimmedTitle.length > 100) {
      throw new Error('Subtask title cannot exceed 100 characters.');
    }

    try {
      const response = await api.post<TodoSubtask>(`/tasks/${taskId}/subtasks`, { title: trimmedTitle });
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return { ...t, subTasks: [...(t.subTasks || []), response.data] };
          }
          return t;
        })
      );
      return response.data;
    } catch (error) {
      console.error('Failed to create subtask:', error);
      throw error;
    }
  };

  const updateSubTask = async (subTaskId: string, updatedData: Partial<TodoSubtask>) => {
    if (updatedData.title !== undefined) {
      const trimmed = updatedData.title.trim();
      if (!trimmed || trimmed.length === 0) {
        throw new Error('Subtask title cannot be empty.');
      }
      if (trimmed.length > 100) {
        throw new Error('Subtask title cannot exceed 100 characters.');
      }
      updatedData = { ...updatedData, title: trimmed };
    }

    try {
      const response = await api.put<TodoSubtask>(`/subtasks/${subTaskId}`, updatedData);
      setTasks((prev) =>
        prev.map((t) => {
          const subTaskExists = (t.subTasks || []).some((s) => s.id === subTaskId);
          if (subTaskExists) {
            return {
              ...t,
              subTasks: t.subTasks.map((s) => (s.id === subTaskId ? { ...s, ...response.data } : s)),
            };
          }
          return t;
        })
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update subtask:', error);
      throw error;
    }
  };

  const deleteSubTask = async (taskId: string, subTaskId: string) => {
    try {
      await api.delete(`/subtasks/${subTaskId}`);
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return { ...t, subTasks: (t.subTasks || []).filter((s) => s.id !== subTaskId) };
          }
          return t;
        })
      );
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      throw error;
    }
  };

  return {
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
  };
};

export default useTasks;
