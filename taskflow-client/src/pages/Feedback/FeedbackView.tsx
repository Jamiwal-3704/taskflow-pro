import React, { useState } from 'react';
import api from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import { Send, CheckCircle2, MessageSquare, User, Mail, Phone, Hash, Sparkles, MessageCircleHeart } from 'lucide-react';

export const FeedbackView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateName = (val: string) => (/\d/.test(val) ? 'Name cannot contain numbers.' : '');
  const validatePhone = (val: string) => (/[a-zA-Z]/.test(val) ? 'Contact number cannot contain letters.' : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'name') error = validateName(value);
    if (name === 'contactNumber') error = validatePhone(value);

    if (name === 'contactNumber' && /[a-zA-Z]/.test(value)) return;
    if (name === 'name' && /\d/.test(value)) return;

    setFormData(prev => ({ ...prev, [name]: value }));
    if (error || errors[name]) setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.contactNumber.trim() || formData.contactNumber.length < 5) newErrors.contactNumber = 'Valid number required';
    if (!formData.subject.trim()) newErrors.subject = 'Required';
    if (!formData.description.trim()) newErrors.description = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post(ENDPOINTS.FEEDBACK.BASE, formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', contactNumber: '', subject: '', description: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 pt-6 px-4">
      
      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Side: Copy & Aesthetics */}
        <div className="lg:col-span-5 space-y-8 relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-40 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              We're Listening
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Help Us Build <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Something Better
              </span>
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8">
              Whether you found a pesky bug, have a brilliant feature idea, or just want to say hello—your input directly shapes the future of TaskFlow Pro.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                  <MessageCircleHeart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Direct Developer Access</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your feedback goes straight to the core engineering team. No middle-men.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Sexy Form */}
        <div className="lg:col-span-7 relative">
          
          {isSuccess && (
            <div className="absolute -top-16 left-0 right-0 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400">Feedback Transmitted!</h4>
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">Thank you. Your message is safely in our database.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative glass-card p-6 sm:p-8 rounded-[2rem] space-y-6 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name Input */}
              <div className="space-y-1.5 group">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <User className="w-3.5 h-3.5" /> Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-4 py-3 rounded-xl text-sm focus:outline-none bg-slate-100/50 dark:bg-slate-900/50 border ${errors.name ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500/50 focus:bg-blue-500/5'} transition-all`}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="absolute right-3 top-3 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">{errors.name}</span>}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5 group">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-4 py-3 rounded-xl text-sm focus:outline-none bg-slate-100/50 dark:bg-slate-900/50 border ${errors.email ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500/50 focus:bg-blue-500/5'} transition-all`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="absolute right-3 top-3 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">{errors.email}</span>}
                </div>
              </div>

              {/* Phone Input */}
              <div className="md:col-span-2 space-y-1.5 group">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-purple-500 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-4 py-3 rounded-xl text-sm focus:outline-none bg-slate-100/50 dark:bg-slate-900/50 border ${errors.contactNumber ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-purple-500/50 focus:bg-purple-500/5'} transition-all`}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.contactNumber && <span className="absolute right-3 top-3 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">{errors.contactNumber}</span>}
                </div>
              </div>

              {/* Subject Input */}
              <div className="md:col-span-2 space-y-1.5 group">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-pink-500 transition-colors">
                  <Hash className="w-3.5 h-3.5" /> Subject
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full pl-4 pr-4 py-3 rounded-xl text-sm focus:outline-none bg-slate-100/50 dark:bg-slate-900/50 border ${errors.subject ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-pink-500/50 focus:bg-pink-500/5'} transition-all`}
                    placeholder="e.g. Feature Request: Dark Mode"
                  />
                  {errors.subject && <span className="absolute right-3 top-3 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">{errors.subject}</span>}
                </div>
              </div>

              {/* Description Input */}
              <div className="md:col-span-2 space-y-1.5 group">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> Message Details
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full pl-4 pr-4 py-3 rounded-xl text-sm focus:outline-none bg-slate-100/50 dark:bg-slate-900/50 border resize-none ${errors.description ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 focus:bg-emerald-500/5'} transition-all`}
                    placeholder="Tell us everything..."
                  />
                  {errors.description && <span className="absolute right-3 top-3 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">{errors.description}</span>}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Transmit Feedback
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
