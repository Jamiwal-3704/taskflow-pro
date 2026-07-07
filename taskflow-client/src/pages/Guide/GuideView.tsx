import React, { useState } from 'react';

interface GuideSection {
  title: string;
  icon: string;
  badge: string;
  gradient: string;
  lightGradient: string;
  description: string;
  steps: string[];
  tips: string[];
}

export const GuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const sections: GuideSection[] = [
    {
      title: 'Task Management & Smart Metrics',
      icon: '📋',
      badge: 'Core Feature',
      gradient: 'from-blue-600 to-indigo-600',
      lightGradient: 'from-blue-500 to-indigo-500',
      description: 'Manage standard tasks using List or Kanban Board layouts, with built-in time performance tracking.',
      steps: [
        'Toggle layouts (List vs Board) using the top navigation bar actions.',
        'Set task deadlines. When a task is completed, TaskFlow Pro calculates performance.',
        'Look at completed cards to see badges like "Before Time" (green) or "Time Exceed" (red) showing exact durations.',
        'Use the right-side Display Drawer to sort (Smart, Manual, Priority, Deadline) or filter your tasks.',
      ],
      tips: [
        'Task status colors transition dynamically: Pending (Orange border) → Working (Yellow border) → Complete (Green border).',
        'Mark tasks with a Star (⭐) to instantly aggregate them inside the global "Important" cross-list page.',
      ],
    },
    {
      title: 'Workout & Metric Trackers',
      icon: '🏋️',
      badge: 'Advanced Feature',
      gradient: 'from-purple-600 to-pink-600',
      lightGradient: 'from-purple-500 to-pink-500',
      description: 'Log workouts, habits, or study progress using modular templates with dynamic metric volume calculations.',
      steps: [
        'Create a "Tracker" type list and choose a template (e.g. "Gym Workout Tracker").',
        'The screen splits: Library catalog (Left) shows exercises grouped by muscle; Workspace (Right) holds today\'s log.',
        'Search and drag-and-drop exercises from the catalog directly into your active workspace.',
        'Adjust weight (LBS) and Reps for each set using the inline "+" and "-" buttons.',
        'Check the set completion checkmark to record the volume.',
      ],
      tips: [
        'The tracker auto-calculates total volume (sets × weight × reps) in real-time at both exercise and session levels.',
        'Unit labels are fully generic (e.g. LBS/Reps for Gym, Distance/Time for Running, Pages/Minutes for Study).',
      ],
    },
    {
      title: 'Week Strip Planner',
      icon: '📅',
      badge: 'Calendar View',
      gradient: 'from-emerald-600 to-teal-600',
      lightGradient: 'from-emerald-500 to-teal-500',
      description: 'Navigate task history and plan upcoming schedules using the week calendar strip planner.',
      steps: [
        'The Week Strip (Mon–Sun dates) is pinned to the top of day-wise pages.',
        'Click any date to load the task list or logged workout session registered for that day.',
        'Logged past days are displayed as read-only summaries so you can check what you did.',
        "Today's date is fully editable to log active work and workout sessions.",
      ],
      tips: [
        'A small colored dot appears under calendar dates where a session was recorded, showing your consistency streak!',
        'You can drag tasks directly onto day columns to schedule them.',
      ],
    },
    {
      title: 'Real-Time Collaboration',
      icon: '🤝',
      badge: 'SignalR Sockets',
      gradient: 'from-orange-500 to-rose-600',
      lightGradient: 'from-orange-500 to-rose-500',
      description: 'Collaborate with teammates or workout partners in real-time via SignalR WebSockets.',
      steps: [
        'Toggle "Collaborative" when creating or editing a custom todo or tracker list.',
        'Invite teammates using their email addresses in the list settings modal.',
        'Once they accept, any task additions, status updates, or logged sets update on everyone\'s screens instantly.',
      ],
      tips: [
        'You can open the same list in two separate browser windows to see real-time updates synchronizing in milliseconds!',
        'Active collaborators are highlighted in the header bar of the list.',
      ],
    },
  ];

  const active = sections[activeTab];

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 space-y-6">
      {/* Header */}
      <header className="mb-2 text-center md:text-left">
        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #818cf8 50%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          TaskFlow Pro Tour &amp; Guide
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Welcome! Explore this walkthrough page to understand how to use our smart task features and generic tracker lists.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div
        className="flex flex-wrap gap-2 pb-4"
        style={{ borderBottom: '1px solid var(--glass-border)' }}
      >
        {sections.map((sec, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className="px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer"
            style={
              activeTab === index
                ? {
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    color: '#ffffff',
                    boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
                  }
                : {
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-secondary)',
                    backdropFilter: 'blur(8px)',
                  }
            }
            onMouseEnter={(e) => {
              if (activeTab !== index) {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== index) {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--glass-border)';
              }
            }}
          >
            <span className="mr-1.5">{sec.icon}</span>
            {sec.title.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div
        className="rounded-2xl overflow-hidden shadow-xl theme-bg-transition"
        style={{
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Gradient Header */}
        <div
          className={`p-6 bg-gradient-to-br ${active.gradient} text-white relative overflow-hidden`}
        >
          {/* Subtle mesh texture overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            }}
          />
          <div className="relative z-10">
            <div
              className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              {active.badge}
            </div>
            <div className="text-4xl mb-2">{active.icon}</div>
            <h2 className="text-2xl font-extrabold">{active.title}</h2>
            <p className="mt-2 text-white/80 text-sm max-w-2xl leading-relaxed">
              {active.description}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div
          className="p-6 space-y-6 theme-bg-transition"
          style={{ background: 'var(--card-bg)' }}
        >
          {/* Steps */}
          <div>
            <h3
              className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2"
              style={{ color: '#3b82f6' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              How to Use
            </h3>
            <ol className="space-y-3.5">
              {active.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <span
                    className="flex items-center justify-center text-blue-500 font-black rounded-full w-6 h-6 text-[10px] shrink-0 mt-0.5"
                    style={{
                      background: 'rgba(59,130,246,0.12)',
                      border: '1px solid rgba(59,130,246,0.25)',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }} className="leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--glass-border)' }} />

          {/* Tips */}
          <div>
            <h3
              className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-amber-500"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              Pro Tips
            </h3>
            <ul className="space-y-3">
              {active.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <span className="shrink-0 text-base">💡</span>
                  <span style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Next Feature Card */}
      <div
        className="rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 theme-bg-transition"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div>
          <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            Need a visual walk-through?
          </h4>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Get started by creating your first Task List or a Gym Workout Tracker from the sidebar.
          </p>
        </div>
        <button
          onClick={() => setActiveTab((prev) => (prev + 1) % sections.length)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shrink-0"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}
        >
          Next Feature Tour →
        </button>
      </div>
    </div>
  );
};

export default GuideView;
