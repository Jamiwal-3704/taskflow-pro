import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

export const OnboardingWizard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Profile setup states
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl || null);
  const [usageType, setUsageType] = useState<number>(user?.usageType || 0);

  const handleNext = () => {
    // If Personal, skip calendar setup step to keep onboarding brief
    if (step === 3 && usageType === 0) {
      handleComplete();
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    try {
      await updateProfile(displayName, usageType, avatarUrl || undefined);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save profile during onboarding:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 onNext={handleNext} />;
      case 2:
        return (
          <Step2
            displayName={displayName}
            setDisplayName={setDisplayName}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3
            usageType={usageType}
            setUsageType={setUsageType}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return <Step4 onComplete={handleComplete} onBack={handleBack} />;
      default:
        return <Step1 onNext={handleNext} />;
    }
  };

  const totalSteps = 4;
  const stepLabels = ['Welcome', 'Profile', 'Usage', 'Finish'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/60 relative overflow-hidden">
        {/* Step Indicator Progress Bar — Numbered circles with connectors */}
        <div className="mb-8 px-4">
          <div className="flex items-center justify-between relative">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => {
              const isActive = s === step;
              const isComplete = s < step;
              return (
                <React.Fragment key={s}>
                  {/* Step circle */}
                  <div className="flex flex-col items-center z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                        isComplete
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : isActive
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20 scale-110'
                          : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      {isComplete ? '✓' : s}
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1.5 transition-colors ${
                        isComplete || isActive ? 'text-blue-400' : 'text-slate-600'
                      }`}
                    >
                      {stepLabels[s - 1]}
                    </span>
                  </div>

                  {/* Connector line (except after last step) */}
                  {s < totalSteps && (
                    <div className="flex-1 mx-1 mb-5">
                      <div className="h-0.5 rounded-full overflow-hidden bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            s < step ? 'bg-blue-500 w-full' : 'bg-transparent w-0'
                          }`}
                          style={{ width: s < step ? '100%' : '0%' }}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Component View */}
        <div className="relative animate-fade-in">{renderStep()}</div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
