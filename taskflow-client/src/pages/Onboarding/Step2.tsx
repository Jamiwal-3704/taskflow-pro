import React from 'react';
import AvatarSelector from '../../components/ui/AvatarSelector';

interface Step2Props {
  displayName: string;
  setDisplayName: (val: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (val: string | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2: React.FC<Step2Props> = ({
  displayName,
  setDisplayName,
  avatarUrl,
  setAvatarUrl,
  onNext,
  onBack,
}) => {
  // Removed old file input logic

  const handleNextSubmit = () => {
    if (!displayName.trim()) {
      alert('Please enter a display name to continue.');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Setup Your Profile</h2>
        <p className="text-slate-400 text-xs mt-1.5">How would you like to be displayed in your workspace?</p>
      </div>

      {/* Avatar Sticker Selector */}
      <div className="py-4 text-left max-w-sm mx-auto">
        <AvatarSelector 
          selectedUrl={avatarUrl}
          onSelect={setAvatarUrl}
        />
      </div>

      <div className="max-w-xs mx-auto text-left">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Jamiwal"
          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
        />
      </div>

      <div className="flex items-center justify-center gap-3 pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 border border-slate-750 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer text-xs"
        >
          Back
        </button>
        <button
          onClick={handleNextSubmit}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer text-xs"
        >
          Continue &rarr;
        </button>
      </div>
    </div>
  );
};

export default Step2;
