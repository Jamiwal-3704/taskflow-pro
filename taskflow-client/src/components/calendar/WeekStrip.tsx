import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface WeekStripProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  streakDates?: string[];
}

export const WeekStrip: React.FC<WeekStripProps> = ({
  selectedDate,
  onChangeDate,
  streakDates = [],
}) => {
  const monday = startOfWeek(selectedDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }).map((_, index) =>
    addDays(monday, index)
  );

  const hasStreak = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    return streakDates.some((sd) => sd.startsWith(key));
  };

  return (
    <div
      className="flex items-center justify-between gap-1.5 md:gap-3 p-2 md:p-3 rounded-2xl w-full max-w-lg mx-auto select-none glass-panel"
    >
      {weekDays.map((day) => {
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());
        const showDot = hasStreak(day);

        return (
          <button
            key={day.toString()}
            onClick={() => onChangeDate(day)}
            className="flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-200 cursor-pointer"
            style={
              isSelected
                ? {
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
                    transform: 'scale(1.05)',
                  }
                : {
                    background: 'var(--hover-bg)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--glass-border)',
                  }
            }
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--glass-bg)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--hover-bg)';
              }
            }}
          >
            <span className="text-[9px] font-black uppercase tracking-wider opacity-70">
              {format(day, 'E')}
            </span>
            <span
              className="text-sm font-extrabold mt-1 tracking-tight"
              style={isToday && !isSelected ? { color: '#3b82f6' } : undefined}
            >
              {format(day, 'd')}
            </span>
            <span
              className={`w-1 h-1 rounded-full mt-1.5 ${
                showDot
                  ? isSelected ? 'bg-white' : 'bg-blue-400'
                  : isToday
                  ? isSelected ? 'bg-white/50' : 'bg-blue-400/50'
                  : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default WeekStrip;
