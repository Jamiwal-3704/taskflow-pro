import React from 'react';
import type { TodoTask } from '../../types/task';
import { format, parseISO } from 'date-fns';

interface TaskCardProps {
  task: TodoTask;
  onStatusChange: (id: string, status: number) => void;
  onImportantChange: (id: string, isImportant: boolean) => void;
  onCardClick: (task: TodoTask) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onImportantChange,
  onCardClick,
  draggable,
  onDragStart,
}) => {
  // Format dates: [DD/MM/YY | HH:MM PM]
  const formatTimestamp = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd/MM/yy | h:mm a');
    } catch {
      return dateStr;
    }
  };

  const getPriorityBadge = (p: number) => {
    switch (p) {
      case 1:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-900/30 text-blue-400 border border-blue-800/30">Low</span>;
      case 2:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-yellow-900/30 text-yellow-400 border border-yellow-800/30">Medium</span>;
      case 3:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-orange-900/30 text-orange-400 border border-orange-800/30">High</span>;
      case 4:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-900/30 text-rose-450 border border-rose-800/30">Critical</span>;
      default:
        return null;
    }
  };

  // Checklist completion fraction (safe access — subTasks may be undefined from partial API responses)
  const subs = task.subTasks || [];
  const subTasksCompleted = subs.filter((s) => s.isCompleted).length;
  const totalSubTasks = subs.length;

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 2;

  // Calculate Time Performance Display
  const renderTimePerformance = () => {
    if (task.status !== 2 || task.timePerformanceMinutes === null) return null;

    const absMinutes = Math.abs(task.timePerformanceMinutes);
    let timeText = `${absMinutes}Min`;
    if (absMinutes >= 60) {
      const hrs = (absMinutes / 60).toFixed(1);
      timeText = `${hrs}Hr`;
    }

    if (task.timePerformanceMinutes >= 0) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 animate-pulse">
          Before Time: {timeText}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950/40 text-rose-400 border border-rose-800/30">
          Time Exceed: {timeText}
        </span>
      );
    }
  };

  const getBorderColor = () => {
    switch (task.status) {
      case 1:
        return 'border-yellow-500/30 hover:border-yellow-500/50 shadow-yellow-500/2'; // Working
      case 2:
        return 'border-emerald-500/30 hover:border-emerald-500/50 shadow-emerald-500/2'; // Completed
      default:
        return 'border-orange-500/30 hover:border-orange-500/50 shadow-orange-500/2'; // Pending
    }
  };

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={() => onCardClick(task)}
      className={`p-4 glass-card border ${getBorderColor()} rounded-xl cursor-pointer flex flex-col justify-between gap-3 shadow-md transition-all hover:scale-[1.01] ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div>
        {/* Title and Star */}
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight truncate max-w-[85%]">
            {task.title}
          </h4>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onImportantChange(task.id, !task.isImportant);
            }}
            type="button"
            className={`text-sm cursor-pointer hover:scale-120 transition-transform ${
              task.isImportant ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-400 dark:text-slate-600'
            }`}
          >
            ★
          </button>
        </div>

        {/* Description Snippet */}
        {task.description && (
          <div className="text-slate-650 dark:text-slate-400 text-[11px] leading-relaxed mt-1.5 line-clamp-2">
            {(() => {
              try {
                const parsed = JSON.parse(task.description);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].hasOwnProperty('text')) {
                  return parsed.map((item: any, i: number) => (
                    <span key={item.id} className={item.isCompleted ? 'line-through opacity-70' : ''}>
                      {item.isCompleted ? '✓ ' : '• '}
                      {item.text}
                      {i < parsed.length - 1 ? '  ' : ''}
                    </span>
                  ));
                }
              } catch {
                // Not JSON, render as normal text
              }
              return task.description;
            })()}
          </div>
        )}
      </div>

      {/* Badges & Metrics Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {getPriorityBadge(task.priority)}
        {totalSubTasks > 0 && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300/30 dark:border-slate-750">
            {subTasksCompleted}/{totalSubTasks} Checklist
          </span>
        )}
        {renderTimePerformance()}
      </div>

      {/* Footer Timestamp & Status Button */}
      <div className="flex items-center justify-between border-t border-slate-200/10 dark:border-slate-850 pt-2.5 mt-1">
        <div className="flex flex-col gap-0.5 text-[9px] text-slate-500 font-medium">
          <div>Log: {formatTimestamp(task.createdAt)}</div>
          {task.deadline && (
            <div className={`${isOverdue ? 'text-rose-500 font-bold' : ''}`}>
              Due: {formatTimestamp(task.deadline)}
            </div>
          )}
        </div>

        {/* Status trigger */}
        {task.status !== 2 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, task.status + 1);
            }}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer select-none hover:scale-[1.03] ${
              task.status === 0
                ? 'bg-orange-600/15 text-orange-600 dark:text-orange-400 hover:bg-orange-600/25 border border-orange-500/20'
                : 'bg-yellow-600/15 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-600/25 border border-yellow-500/20'
            }`}
          >
            {task.status === 0 ? 'Start Work' : 'Complete'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
