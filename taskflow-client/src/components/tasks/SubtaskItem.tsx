import React from 'react';
import type { TodoSubtask } from '../../types/task';

interface SubtaskItemProps {
  subTask: TodoSubtask;
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export const SubtaskItem: React.FC<SubtaskItemProps> = ({ subTask, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-950/60 border border-slate-850 rounded-xl hover:border-slate-800 transition-colors group">
      <div className="flex items-center gap-2.5 min-w-0">
        <input
          type="checkbox"
          checked={subTask.isCompleted}
          onChange={(e) => onToggle(subTask.id, e.target.checked)}
          className="w-4 h-4 rounded border-slate-800 bg-slate-950 accent-blue-500 cursor-pointer shrink-0"
        />
        <span
          className={`text-xs truncate transition-all ${
            subTask.isCompleted ? 'line-through text-slate-500' : 'text-slate-350'
          }`}
        >
          {subTask.title}
        </span>
      </div>

      <button
        onClick={() => onDelete(subTask.id)}
        type="button"
        className="text-[10px] text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-0.5"
        title="Delete checklist item"
      >
        🗑️
      </button>
    </div>
  );
};

export default SubtaskItem;
