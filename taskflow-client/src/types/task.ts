export interface TodoSubtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  sortOrder: number;
}

export interface TodoTask {
  id: string;
  listId: string;
  assigneeId: string | null;
  title: string;
  description: string | null;
  status: number;  // 0 = Pending, 1 = Working, 2 = Complete
  priority: number; // 0 = None, 1 = Low, 2 = Med, 3 = High, 4 = Critical
  isImportant: boolean;
  createdAt: string;
  workStartedAt: string | null;
  completedAt: string | null;
  deadline: string | null;
  plannedDate: string | null;
  sortIndex: number;
  timePerformanceMinutes: number | null;
  subTasks: TodoSubtask[];
}
