import React, { useRef } from 'react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live avatar letter extraction
  const getAvatarLetter = () => {
    const trimmed = displayName.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock File Upload Reader for local previews
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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

      {/* Live Avatar Preview */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div
          onClick={triggerFileInput}
          className="w-24 h-24 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center cursor-pointer relative group overflow-hidden shadow-inner select-none"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-extrabold text-blue-400 tracking-tight transition-transform group-hover:scale-110">
              {getAvatarLetter()}
            </span>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity duration-200">
            Change Photo
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={triggerFileInput}
          type="button"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          Upload Photo
        </button>
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
