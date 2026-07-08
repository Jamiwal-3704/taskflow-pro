import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const LiveClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return (
    <div className="conic-glow-wrapper mt-4">
      <div className="conic-glow-inner p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <div className="font-mono font-bold tracking-tight text-slate-800 dark:text-slate-100 text-sm">
            {displayHours}:{minutes}
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 font-semibold opacity-80">
              :{seconds}
            </span>
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-sm">
          {ampm}
        </div>
      </div>
    </div>
  );
};

export default LiveClock;
