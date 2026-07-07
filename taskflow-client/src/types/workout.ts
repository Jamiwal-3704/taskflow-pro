export interface WorkoutTemplate {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  templateId: string;
  category: string;
  name: string;
  description: string | null;
  metricLabel1: string; // e.g. Weight (kg)
  metricLabel2: string; // e.g. Reps
}

export interface WorkoutSetLog {
  id: string;
  loggedExerciseId: string;
  setIndex: number; // Set number: 1, 2, 3
  weight: number; // weight value (KG)
  reps: number; // reps count
  isCompleted: boolean;
}

export interface WorkoutLoggedExercise {
  id: string;
  sessionId: string;
  exerciseId: string;
  name: string;
  category: string;
  metricLabel1: string;
  metricLabel2: string;
  sortOrder: number;
  setLogs: WorkoutSetLog[];
}

export interface WorkoutSession {
  id: string;
  listId: string;
  date: string;
  notes: string | null;
  totalVolume: number; // Calculated volume (weight * reps)
  loggedExercises: WorkoutLoggedExercise[];
}
