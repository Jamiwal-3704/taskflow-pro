export interface TodoList {
  id: string;
  name: string;
  colorHex: string | null;
  icon: string | null;
  listType: number; // 0 = Todo, 1 = Tracker
  workoutTemplateId: string | null;
  isCollaborative: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface ListPreference {
  id: string;
  userId: string;
  listId: string;
  viewType: number; // 0 = List, 1 = Board
  sortBy: number;   // 0 = Smart, 1 = Manual, 2 = Name, etc.
  groupBy: number;  // 0 = None, 1 = Priority, etc.
  filterJson: string | null;
}

export type ViewType = 'list' | 'board';
export type SortOption = 'smart' | 'manual' | 'name' | 'assignee' | 'date' | 'dateAdded' | 'deadline' | 'priority' | 'project' | 'workspace';
