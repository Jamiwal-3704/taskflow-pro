import React, { useState } from 'react';

interface Step4Props {
  onComplete: () => Promise<void>;
  onBack: () => void;
}

export const Step4: React.FC<Step4Props> = ({ onComplete, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleConnect = () => {
    // In production, this redirects to Google OAuth
    alert('Connecting to Google Calendar API... (OAuth Flow Mocked)');
  };

  const handleOutlookConnect = () => {
    // In production, this redirects to Outlook OAuth
    alert('Connecting to Outlook Calendar API... (OAuth Flow Mocked)');
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await onComplete();
    } catch (error) {
      console.error(error);
      alert('Failed to save profile settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Connect Your Calendars</h2>
        <p className="text-slate-400 text-xs mt-1.5">
          Link Google or Outlook Calendar to automatically sync task deadlines.
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-xs mx-auto pt-4">
        {/* Google Calendar Connect */}
        <button
          onClick={handleGoogleConnect}
          type="button"
          className="flex items-center justify-between px-4 py-3 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl cursor-pointer transition-colors text-xs font-semibold text-slate-200 select-none"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">📅</span>
            <span>Google Calendar</span>
          </div>
          <span className="text-blue-400">Connect</span>
        </button>

        {/* Outlook Calendar Connect */}
        <button
          onClick={handleOutlookConnect}
          type="button"
          className="flex items-between justify-between px-4 py-3 bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-xl cursor-pointer transition-colors text-xs font-semibold text-slate-200 select-none"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">📧</span>
            <span>Outlook Calendar</span>
          </div>
          <span className="text-blue-400">Connect</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 pt-6">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-650 border border-slate-750 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer text-xs disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleFinish}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer text-xs disabled:opacity-50"
        >
          {isSubmitting ? 'Finishing...' : 'Complete & Finish'}
        </button>
      </div>
    </div>
  );
};

export default Step4;
