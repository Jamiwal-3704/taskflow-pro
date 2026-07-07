import React from 'react';

interface Step1Props {
  onNext: () => void;
}

export const Step1: React.FC<Step1Props> = ({ onNext }) => {
  const highlights = [
    { icon: '🎯', title: 'Smart Task Management', desc: 'Organize tasks into list or board views with automatic completion-time analysis.' },
    { icon: '🏋️', title: 'Dynamic Trackers', desc: 'Create metric-based templates like Gym Workouts to log sets, reps, and calculate volumes.' },
    { icon: '📅', title: 'Week Strip Planner', desc: 'Navigate, schedule, and view logged past history calendar date-wise.' },
    { icon: '🤝', title: 'Real-Time Sync', desc: 'Invite team members to collaborate on tasks and tracker logs instantly.' }
  ];

  return (
    <div className="space-y-6 text-center">
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 text-3xl font-extrabold shadow-lg shadow-blue-500/5 mb-2">
        TF
      </div>
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
          Welcome to TaskFlow Pro
        </h2>
        <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto leading-relaxed">
          The ultimate workspace for your daily schedules, collaborative tasks, and modular workout tracking logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto pt-4 text-left">
        {highlights.map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 hover:bg-slate-900/90 cursor-default">
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <h4 className="font-semibold text-slate-200 text-sm">{item.title}</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer text-sm"
        >
          Get Started &rarr;
        </button>
      </div>
    </div>
  );
};

export default Step1;
