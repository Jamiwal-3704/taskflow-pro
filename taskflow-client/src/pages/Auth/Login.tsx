import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const validateEmail = (v: string): string => {
  if (!v) return '';
  if (v !== v.toLowerCase()) return 'Email must be lowercase only.';
  if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(v)) return 'Enter a valid email, e.g. example@gmail.com';
  return '';
};

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

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [apiError, setApiError] = useState<string | null>(null);

  const emailError = useMemo(() => (touched.email ? validateEmail(email) : ''), [email, touched.email]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setTouched({ email: true, password: true });

    if (!email.trim() || !password) {
      setApiError('Please enter both email and password.');
      return;
    }
    const err = validateEmail(email);
    if (err) {
      setApiError(err);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      const cleanMsg = extractErrorMessage(error);
      setApiError(cleanMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
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
          <h2 className="!text-white text-2xl font-bold">Welcome Back</h2>
          <p className="!text-slate-300 text-sm mt-1.5">Sign in to sync your collaborative tasks &amp; trackers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative" noValidate>
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
              <span className="text-red-400 mt-0.5 shrink-0 text-sm">⚠️</span>
              <div className="flex-1 whitespace-pre-line leading-relaxed font-medium">
                {apiError}
              </div>
            </div>
          )}

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

          <div>
            <label className="block text-xs font-semibold !text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              placeholder="••••••••"
              className={inputClass(touched.password && password.length === 0)}
              disabled={isSubmitting}
            />
            {touched.password && password.length === 0 && (
              <p className="text-red-400 text-[11px] mt-1 font-medium animate-pulse">Password is required.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm !text-slate-300 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline font-medium">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
