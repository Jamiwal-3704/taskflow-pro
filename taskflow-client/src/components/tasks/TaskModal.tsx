import React, { useState } from 'react';
import type { TodoTask, TodoSubtask } from '../../types/task';
import SubtaskItem from './SubtaskItem';
import LineItemEditor from './LineItemEditor';

interface TaskModalProps {
  isOpen: boolean;
  task: TodoTask | null;
  onClose: () => void;
  onUpdate: (id: string, updatedData: Partial<TodoTask>) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
  onCreateSubtask: (taskId: string, title: string) => Promise<any>;
  onUpdateSubtask: (subTaskId: string, updatedData: any) => Promise<any>;
  onDeleteSubtask: (taskId: string, subTaskId: string) => Promise<void>;
  initialError?: string | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  task,
  onClose,
  onUpdate,
  onDelete,
  onCreateSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  initialError,
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 0);
  const [deadline, setDeadline] = useState(task?.deadline ? task.deadline.substring(0, 16) : '');
  const [plannedDate, setPlannedDate] = useState(task?.plannedDate ? task.plannedDate.substring(0, 10) : '');
  const [colorHex, setColorHex] = useState(task?.colorHex || '');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const PRESET_COLORS = [
    { value: '', label: 'None' },
    { value: '#ef4444', label: 'Red' },
    { value: '#f97316', label: 'Orange' },
    { value: '#eab308', label: 'Yellow' },
    { value: '#22c55e', label: 'Green' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#a855f7', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
  ];

  // Sync state values only when modal opens or selected task changes
  React.useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDeadline(task.deadline ? task.deadline.substring(0, 16) : '');
      setPlannedDate(task.plannedDate ? task.plannedDate.substring(0, 10) : '');
      setColorHex(task.colorHex || '');
      setErrorMsg(initialError || null);
    }
  }, [task?.id, isOpen, initialError]);

  if (!isOpen || !task) return null;

  // Calculate local 'today' boundaries to prevent past date selection
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const minDateTime = now.toISOString().slice(0, 16); // YYYY-MM-DDThh:mm

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (deadline && plannedDate) {
      if (new Date(deadline) < new Date(plannedDate)) {
        setErrorMsg('Due date cannot be earlier than the planned date!');
        return;
      }
    }
    setErrorMsg(null);

    setIsSaving(true);
    try {
      await onUpdate(task.id, {
        title,
        description: description || null,
        priority,
        colorHex: colorHex || null,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        plannedDate: plannedDate ? new Date(plannedDate).toISOString() : null,
      });
      onClose();
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
        onClose();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    try {
      await onCreateSubtask(task.id, newSubtaskTitle);
      setNewSubtaskTitle('');
    } catch (err) {
      console.error('Failed to add subtask:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto theme-bg-transition border border-slate-200/5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-250/20 dark:border-slate-850">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Edit Task Details</h3>
          <button
            onClick={onClose}
            className="text-slate-450 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-350 cursor-pointer text-sm font-semibold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          {/* Main Edit Form */}
          <form onSubmit={handleSave} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none glass-input"
                disabled={isSaving}
              />
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-2">Card Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColorHex(c.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${colorHex === c.value ? 'border-slate-800 dark:border-slate-100 scale-125' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: c.value || 'var(--hover-bg)' }}
                    title={c.label}
                  >
                    {!c.value && <span className="text-[10px] text-slate-500 flex items-center justify-center h-full">✕</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Description / Checklist */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-2">Description / Routine</label>
              <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-200/50 dark:border-slate-800">
                <LineItemEditor 
                  value={description}
                  onChange={setDescription}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none glass-input"
                >
                  <option value={0}>None</option>
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                  <option value={4}>Critical</option>
                </select>
              </div>

              {/* Planned Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-2">Planned Date</label>
                <input
                  type="date"
                  value={plannedDate}
                  min={minDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                  disabled={task.status === 2}
                  className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none glass-input [color-scheme:light] dark:[color-scheme:dark] ${task.status === 2 ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-2">Due Date & Time</label>
              <input
                type="datetime-local"
                value={deadline}
                min={minDateTime}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  setErrorMsg(null);
                }}
                disabled={task.status === 2}
                className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none glass-input [color-scheme:light] dark:[color-scheme:dark] ${task.status === 2 ? 'opacity-60 cursor-not-allowed' : ''} ${errorMsg ? 'border-rose-500 bg-rose-500/5 text-rose-600' : ''}`}
              />
              {errorMsg && (
                <p className="text-xs text-rose-500 mt-2 font-semibold">⚠️ {errorMsg}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-250/20 dark:border-slate-850">
              <button
                type="button"
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl cursor-pointer transition-colors border border-rose-500/20"
              >
                Delete Task
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 transition-colors shadow-md"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>

          {/* Subtask Checklist Section */}
          <div className="border-t border-slate-250/20 dark:border-slate-850 pt-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-350 uppercase tracking-wider">Checklist Items</h4>

            {/* List of subtasks */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {(task.subTasks || []).map((sub) => (
                <SubtaskItem
                  key={sub.id}
                  subTask={sub}
                  onToggle={(subId, done) => onUpdateSubtask(subId, { isCompleted: done })}
                  onDelete={(subId) => onDeleteSubtask(task.id, subId)}
                />
              ))}

              {(task.subTasks || []).length === 0 && (
                <p className="text-slate-400 dark:text-slate-650 text-xs italic select-none">No subtasks added yet.</p>
              )}
            </div>

            {/* Add Subtask Inline Form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 px-3 py-2 rounded-xl placeholder-slate-400 focus:outline-none text-xs glass-input"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer shrink-0 transition-colors"
              >
                + Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
