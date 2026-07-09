import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

// ── Validation helpers ──────────────────────────────────────────
const validateDisplayName = (v: string): string => {
  const trimmed = v.trim();
  if (!trimmed) return '';
  if (trimmed.length < 2) return 'Must be at least 2 characters.';
  if (trimmed.length > 50) return 'Cannot exceed 50 characters.';
  if (!/^[a-zA-Z\s\-_]+$/.test(trimmed)) return 'Only letters, spaces, hyphens, underscores.';
  return '';
};

const validateEmail = (v: string): string => {
  if (!v) return '';
  if (v !== v.toLowerCase()) return 'Email must be lowercase only.';
  if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(v)) return 'Enter a valid email, e.g. example@gmail.com';
  return '';
};

interface PwdCheck {
  label: string;
  passed: boolean;
}

const getPasswordChecks = (pw: string): PwdCheck[] => [
  { label: 'At least 8 characters', passed: pw.length >= 8 },
  { label: 'At least 1 uppercase letter (A-Z)', passed: /[A-Z]/.test(pw) },
  { label: 'At least 1 lowercase letter (a-z)', passed: /[a-z]/.test(pw) },
  { label: 'At least 1 number (0-9)', passed: /[0-9]/.test(pw) },
  { label: 'At least 1 special character (!@#$...)', passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw) },
];

const allPasswordChecksPassed = (pw: string): boolean => getPasswordChecks(pw).every((c) => c.passed);

// Helper to extract clean error messages from C# API responses
const extractErrorMessage = (error: any): string => {
  if (!error.response) return 'Unable to connect to the server. Please verify your connection.';
  const data = error.response.data;
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) {
    return data.map((d: any) => d.description || d.message || JSON.stringify(d)).join('\n');
  }
  if (data && typeof data === 'object') {
    if (data.errors && typeof data.errors === 'object') {
      const messages: string[] = [];
      Object.keys(data.errors).forEach((key) => {
        const val = data.errors[key];
        if (Array.isArray(val)) {
          messages.push(...val);
        } else if (typeof val === 'string') {
          messages.push(val);
        }
      });
      if (messages.length > 0) return messages.join('\n');
    }
    if (data.message) return data.message;
    if (data.title) return data.title;
  }
  return 'An unexpected error occurred. Please try again.';
};

// ── Component ───────────────────────────────────────────────────
export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Track which fields have been touched (blurred at least once)
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });

  // ── Derived validation states ──
  const nameError = useMemo(() => (touched.name ? validateDisplayName(displayName) : ''), [displayName, touched.name]);
  const emailError = useMemo(() => (touched.email ? validateEmail(email) : ''), [email, touched.email]);
  const pwdChecks = useMemo(() => getPasswordChecks(password), [password]);
  const pwdAllPassed = useMemo(() => allPasswordChecksPassed(password), [password]);

  const confirmMismatch = touched.confirm && confirmPassword.length > 0 && password !== confirmPassword;
  const confirmMatch = touched.confirm && confirmPassword.length > 0 && password === confirmPassword && pwdAllPassed;

  // ── Password strength bar ──
  const strengthPercent = useMemo(() => {
    const passed = pwdChecks.filter((c) => c.passed).length;
    return Math.round((passed / pwdChecks.length) * 100);
  }, [pwdChecks]);

  const strengthColor =
    strengthPercent <= 20 ? 'bg-red-500' :
    strengthPercent <= 40 ? 'bg-orange-500' :
    strengthPercent <= 60 ? 'bg-yellow-500' :
    strengthPercent <= 80 ? 'bg-blue-500' :
    'bg-emerald-500';

  const strengthLabel =
    strengthPercent <= 20 ? 'Very Weak' :
    strengthPercent <= 40 ? 'Weak' :
    strengthPercent <= 60 ? 'Fair' :
    strengthPercent <= 80 ? 'Strong' :
    'Excellent';

  // ── Input styling helper ──
  const inputClass = (hasError: boolean, isValid?: boolean) => {
    const base = 'auth-input w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 focus:outline-none';
    if (hasError) {
      return `${base} bg-red-950/30 border-2 border-red-500/60 text-white placeholder-red-300/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]`;
    }
    if (isValid) {
      return `${base} bg-emerald-950/20 border-2 border-emerald-500/40 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]`;
    }
    return `${base} bg-slate-950/50 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`;
  };

  // ── Submit handler ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Force touch all fields
    setTouched({ name: true, email: true, password: true, confirm: true });

    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      setApiError('All fields are required.');
      return;
    }
    if (validateDisplayName(displayName)) {
      setApiError(validateDisplayName(displayName));
      return;
    }
    if (validateEmail(email)) {
      setApiError(validateEmail(email));
      return;
    }
    if (!pwdAllPassed) {
      setApiError('Password does not meet all complexity requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setApiError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password, displayName.trim());
      toast.success('Account created successfully!');
      navigate('/onboarding');
    } catch (error: any) {
      console.error(error);
      const cleanMsg = extractErrorMessage(error);
      setApiError(cleanMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-6 relative overflow-hidden">
      {/* Animated Global Background Layers */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-blue-700/20 rounded-full blur-[120px] mix-blend-screen animate-blob top-[-20%] left-[-10%] opacity-70"></div>
        <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000 top-[20%] right-[-10%] opacity-60"></div>
        <div className="absolute w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[110px] mix-blend-screen animate-blob animation-delay-4000 bottom-[-20%] left-[20%] opacity-50"></div>
      </div>
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/80 relative z-10">
        {/* Internal Decorative backdrop gradients */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 mb-3 border border-blue-500/20 text-xl font-bold">
            TF
          </div>
          <h2 className="!text-white text-2xl font-bold">Create Account</h2>
          <p className="!text-slate-300 text-sm mt-1.5">Join TaskFlow Pro to manage your tasks &amp; logs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative" noValidate>
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
              <span className="text-red-400 mt-0.5 shrink-0 text-sm">⚠️</span>
              <div className="flex-1 whitespace-pre-line leading-relaxed font-medium">
                {apiError}
              </div>
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold !text-slate-300 uppercase tracking-wider mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, name: true }))}
              placeholder="e.g. Jamiwal"
              maxLength={50}
              className={inputClass(!!nameError, touched.name && !nameError && displayName.trim().length >= 2)}
              disabled={isSubmitting}
            />
            {nameError && <p className="text-red-400 text-[11px] mt-1 font-medium animate-pulse">{nameError}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold !text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              placeholder="example@gmail.com"
              maxLength={256}
              className={inputClass(!!emailError, touched.email && !emailError && email.length > 5)}
              disabled={isSubmitting}
            />
            {emailError && <p className="text-red-400 text-[11px] mt-1 font-medium animate-pulse">{emailError}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold !text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              placeholder="••••••••"
              maxLength={100}
              className={inputClass(touched.password && !pwdAllPassed && password.length > 0, pwdAllPassed)}
              disabled={isSubmitting}
            />

            {/* Strength Bar */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden mr-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${strengthColor}`}
                      style={{ width: `${strengthPercent}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    strengthPercent <= 40 ? 'text-red-400' :
                    strengthPercent <= 60 ? 'text-yellow-400' :
                    strengthPercent <= 80 ? 'text-blue-400' :
                    'text-emerald-400'
                  }`}>
                    {strengthLabel}
                  </span>
                </div>

                {/* Checklist */}
                <div className="grid grid-cols-1 gap-0.5">
                  {pwdChecks.map((check, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className={`text-[10px] transition-colors ${check.passed ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {check.passed ? '✓' : '○'}
                      </span>
                      <span className={`text-[10px] transition-colors ${check.passed ? 'text-emerald-400/80' : 'text-slate-500'}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold !text-slate-300 uppercase tracking-wider mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
              placeholder="••••••••"
              maxLength={100}
              className={inputClass(confirmMismatch, confirmMatch)}
              disabled={isSubmitting}
            />
            {confirmMismatch && (
              <p className="text-red-400 text-[11px] mt-1 font-medium animate-pulse">Passwords do not match.</p>
            )}
            {confirmMatch && (
              <p className="text-emerald-400 text-[11px] mt-1 font-medium">✓ Passwords match!</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs !text-slate-300 relative">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
