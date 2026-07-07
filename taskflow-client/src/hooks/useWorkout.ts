import { useState, useCallback } from 'react';
import api from '../api/axios';
import ENDPOINTS from '../api/endpoints';
import type {
  WorkoutTemplate,
  WorkoutExercise,
  WorkoutSession,
  WorkoutLoggedExercise,
  WorkoutSetLog,
} from '../types/workout';

export const useWorkout = (listId?: string) => {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await api.get<WorkoutTemplate[]>(ENDPOINTS.WORKOUTS.TEMPLATES);
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch workout templates:', error);
    }
  }, []);

  const fetchExercises = useCallback(async (templateId: string) => {
    try {
      const response = await api.get<WorkoutExercise[]>(
        ENDPOINTS.WORKOUTS.TEMPLATE_EXERCISES(templateId)
      );
      setExercises(response.data);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    }
  }, []);

  const fetchSession = useCallback(async (dateString: string) => {
    if (!listId) return;
    setIsLoading(true);
    try {
      const response = await api.get<WorkoutSession>(
        `${ENDPOINTS.WORKOUTS.SESSIONS}?listId=${listId}&date=${dateString}`
      );
      setSession(response.data);
    } catch (error) {
      console.error('Failed to fetch workout session:', error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  const startSession = async (dateString: string, notes?: string) => {
    if (!listId) return;
    try {
      const response = await api.post<WorkoutSession>(ENDPOINTS.WORKOUTS.SESSIONS, {
        listId,
        date: dateString,
        notes,
      });
      setSession(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to start workout session:', error);
      throw error;
    }
  };

  const addExerciseToSession = async (exerciseId: string) => {
    if (!session) return;
    try {
      const response = await api.post<WorkoutLoggedExercise>(
        ENDPOINTS.WORKOUTS.SESSION_EXERCISES(session.id),
        { exerciseId }
      );
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          loggedExercises: [...(prev.loggedExercises || []), response.data],
        };
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add exercise to session:', error);
      throw error;
    }
  };

  const removeExerciseFromSession = async (loggedExerciseId: string) => {
    try {
      await api.delete(ENDPOINTS.WORKOUTS.REMOVE_EXERCISE(loggedExerciseId));
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          loggedExercises: (prev.loggedExercises || []).filter((e) => e.id !== loggedExerciseId),
        };
      });
    } catch (error) {
      console.error('Failed to remove exercise from session:', error);
      throw error;
    }
  };

  const addSetLog = async (loggedExerciseId: string, setIndex: number, weight: number, reps: number) => {
    // Edge-case validations
    if (setIndex < 1) {
      throw new Error('Set index must be 1 or greater.');
    }
    if (weight < 0) {
      throw new Error('Weight cannot be negative.');
    }
    if (weight > 2000) {
      throw new Error('Weight cannot exceed 2000 kg.');
    }
    if (reps < 0) {
      throw new Error('Reps cannot be negative.');
    }
    if (reps > 500) {
      throw new Error('Reps cannot exceed 500.');
    }
    if (!Number.isFinite(weight) || !Number.isFinite(reps)) {
      throw new Error('Weight and reps must be valid numbers.');
    }

    try {
      const response = await api.post<WorkoutSetLog>(
        ENDPOINTS.WORKOUTS.SET_LOGS(loggedExerciseId),
        { setIndex, weight, reps }
      );
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          loggedExercises: (prev.loggedExercises || []).map((e) => {
            if (e.id === loggedExerciseId) {
              return { ...e, setLogs: [...(e.setLogs || []), response.data] };
            }
            return e;
          }),
        };
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add set log:', error);
      throw error;
    }
  };

  const updateSetLog = async (logId: string, weight: number, reps: number, isCompleted: boolean) => {
    // Edge-case validations
    if (weight < 0) {
      throw new Error('Weight cannot be negative.');
    }
    if (weight > 2000) {
      throw new Error('Weight cannot exceed 2000 kg.');
    }
    if (reps < 0) {
      throw new Error('Reps cannot be negative.');
    }
    if (reps > 500) {
      throw new Error('Reps cannot exceed 500.');
    }

    try {
      const response = await api.put<WorkoutSetLog>(
        ENDPOINTS.WORKOUTS.SET_LOG_DETAIL(logId),
        { weight, reps, isCompleted }
      );
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          loggedExercises: (prev.loggedExercises || []).map((e) => {
            const hasLog = (e.setLogs || []).some((l) => l.id === logId);
            if (hasLog) {
              return {
                ...e,
                setLogs: e.setLogs.map((l) => (l.id === logId ? response.data : l)),
              };
            }
            return e;
          }),
        };
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update set log:', error);
      throw error;
    }
  };

  const deleteSetLog = async (loggedExerciseId: string, logId: string) => {
    try {
      await api.delete(ENDPOINTS.WORKOUTS.SET_LOG_DETAIL(logId));
      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          loggedExercises: (prev.loggedExercises || []).map((e) => {
            if (e.id === loggedExerciseId) {
              return { ...e, setLogs: (e.setLogs || []).filter((l) => l.id !== logId) };
            }
            return e;
          }),
        };
      });
    } catch (error) {
      console.error('Failed to delete set log:', error);
      throw error;
    }
  };

  return {
    session,
    templates,
    exercises,
    isLoading,
    fetchTemplates,
    fetchExercises,
    fetchSession,
    startSession,
    addExerciseToSession,
    removeExerciseFromSession,
    addSetLog,
    updateSetLog,
    deleteSetLog,
  };
};

export default useWorkout;
