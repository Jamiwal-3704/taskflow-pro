import React from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TodoTask } from '../../types/task';

interface MonthCalendarProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  tasks: TodoTask[];
  onDropTask?: (taskId: string, targetDate: Date) => void;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  selectedDate,
  onChangeDate,
  tasks,
  onDropTask
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(selectedDate));
  const [dragOverDate, setDragOverDate] = React.useState<string | null>(null);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Determine dots
  const hasTasks = (day: Date) => {
    return tasks.some(t => t.plannedDate && isSameDay(new Date(t.plannedDate), day));
  };
  
  const hasImportant = (day: Date) => {
    return tasks.some(t => t.plannedDate && isSameDay(new Date(t.plannedDate), day) && t.isImportant);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 select-none">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-100 uppercase">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* Empty cells for start of month offset */}
        {Array.from({ length: currentMonth.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {daysInMonth.map(day => {
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const hasTask = hasTasks(day);
          const important = hasImportant(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onChangeDate(day)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverDate(day.toISOString());
              }}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverDate(null);
                const taskId = e.dataTransfer.getData('taskId');
                if (taskId && onDropTask) {
                  onDropTask(taskId, day);
                }
              }}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer min-h-[44px]
                ${selected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105 z-10' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}
                ${today && !selected ? 'text-blue-500 font-bold border border-blue-500/30' : ''}
                ${dragOverDate === day.toISOString() ? 'border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-900/30 scale-110 z-20' : ''}
              `}
            >
              <span className="text-sm font-semibold">{format(day, 'd')}</span>
              
              {/* Dots container */}
              <div className="flex gap-0.5 mt-1 absolute bottom-1">
                {hasTask && !important && (
                  <span className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-white' : 'bg-blue-400'}`} />
                )}
                {important && (
                  <span className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-amber-300' : 'bg-amber-400'}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
