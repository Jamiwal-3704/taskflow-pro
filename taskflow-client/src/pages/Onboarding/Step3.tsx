import React from 'react';

interface Step3Props {
  usageType: number; // 0 = Personal, 1 = Business
  setUsageType: (val: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3: React.FC<Step3Props> = ({
  usageType,
  setUsageType,
  onNext,
  onBack,
}) => {
  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Choose Your Workspace Type</h2>
        <p className="text-slate-400 text-xs mt-1.5">We will optimize your default view options based on your goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto pt-4 text-left">
        {/* Personal Card */}
        <div
          onClick={() => setUsageType(0)}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-40 select-none ${
            usageType === 0
              ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/5'
              : 'bg-slate-950 border-slate-850 hover:border-slate-800'
          }`}
        >
          <div>
            <div className="text-2xl mb-2">🧑‍💻</div>
            <h4 className="font-bold text-slate-200 text-sm">For Myself</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Track personal tasks, habits, daily workout logs, and manage simple routines.
            </p>
          </div>
          {usageType === 0 && (
            <div className="text-right text-xs font-bold text-blue-400">Selected ✓</div>
          )}
        </div>

        {/* Business/Team Card */}
        <div
          onClick={() => setUsageType(1)}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-40 select-none ${
            usageType === 1
              ? 'bg-purple-600/10 border-purple-500 shadow-lg shadow-purple-500/5'
              : 'bg-slate-950 border-slate-850 hover:border-slate-800'
          }`}
        >
          <div>
            <div className="text-2xl mb-2">🏢</div>
            <h4 className="font-bold text-slate-200 text-sm">With My Team</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Enable real-time collaborative todo lists, team member invitations, and calendar integrations.
            </p>
          </div>
          {usageType === 1 && (
            <div className="text-right text-xs font-bold text-purple-400">Selected ✓</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 border border-slate-750 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer text-xs"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer text-xs"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  );
};

export default Step3;
