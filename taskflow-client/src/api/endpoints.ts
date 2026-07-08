export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  USERS: {
    UPDATE_PROFILE: '/users/profile',
  },
  LISTS: {
    BASE: '/lists',
    REORDER: '/lists/reorder',
  },
  TASKS: {
    BASE: (listId: string) => `/lists/${listId}/tasks`,
    DETAIL: (taskId: string) => `/tasks/${taskId}`,
    STATUS: (taskId: string) => `/tasks/${taskId}/status`,
    IMPORTANT: (taskId: string) => `/tasks/${taskId}/important`,
    ALL_IMPORTANT: '/tasks/important',
    SEARCH: (q: string) => `/tasks/search?q=${encodeURIComponent(q)}`,
  },
  WORKOUTS: {
    TEMPLATES: '/workouts/templates',
    TEMPLATE_EXERCISES: (templateId: string) => `/workouts/templates/${templateId}/exercises`,
    SESSIONS: '/workouts/sessions',
    SESSION_EXERCISES: (sessionId: string) => `/workouts/sessions/${sessionId}/exercises`,
    REMOVE_EXERCISE: (loggedExerciseId: string) => `/workouts/sessions/exercises/${loggedExerciseId}`,
    SET_LOGS: (loggedExerciseId: string) => `/workouts/exercises/${loggedExerciseId}/logs`,
    SET_LOG_DETAIL: (logId: string) => `/workouts/logs/${logId}`,
  },
  FEEDBACK: {
    BASE: '/Feedback',
  },
};
export default ENDPOINTS;
