import React from 'react';
import { User, Code2, Mail, Phone, Shield, Zap, Layers, Server, LayoutTemplate, ShieldAlert, Cpu, Orbit, Database, Briefcase } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20 pt-8 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* 1. DEVELOPER PROFILE SECTION */}
      <section className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="text-center space-y-6">
          {/* Profile Picture */}
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-1 overflow-hidden shadow-2xl">
              {/* Permanent avatar image stored in public/avatars */}
              <img 
                src="/avatars/sahil-profile.jpg" 
                alt="Sahil Ittan" 
                className="w-full h-full object-cover rounded-full fallback-bg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                }}
              />
              <User className="absolute inset-0 m-auto w-16 h-16 text-slate-400 dark:text-slate-700 -z-10" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 tracking-tight">
              Sahil Ittan
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
              Results-driven Full-Stack Developer skilled in React.js, TypeScript, Tailwind CSS, ASP.NET Core Web API, .NET 8, SQL Server, and Microsoft Azure.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="https://github.com/Jamiwal-3704" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white group">
              <Code2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> GitHub
            </a>
            <a href="https://linkedin.com/in/sahilittan" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-colors text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 group border-blue-500/20 hover:border-blue-500/50">
              <Briefcase className="w-4 h-4 group-hover:scale-110 transition-transform" /> LinkedIn
            </a>
            <a href="mailto:ittansahil@gmail.com" className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-colors text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 group border-rose-500/20 hover:border-rose-500/50">
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" /> ittansahil@gmail.com
            </a>
            <a href="tel:+918780064871" className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-emerald-50 dark:hover:bg-emerald-500/20 transition-colors text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 group border-emerald-500/20 hover:border-emerald-500/50">
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" /> +91 8780064871
            </a>
          </div>
        </div>
      </section>

      {/* 2. OTHER PROJECTS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center border border-purple-500/20 dark:border-purple-500/30">
            <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Other Ventures</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* InsureTrust */}
          <div className="glass-card p-6 rounded-3xl space-y-4 hover:-translate-y-1 transition-all duration-300 border-t-2 border-t-blue-500/50">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">InsureTrust</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase">Insurance Management Platform</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Microservices-based platform featuring secure REST APIs, KYC verification, admin dashboards, and premium calculators.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-transparent">.NET 8</span>
              <span className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-transparent">SQL Server</span>
              <span className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-transparent">Azure</span>
            </div>
          </div>

          {/* HungryHub */}
          <div className="glass-card p-6 rounded-3xl space-y-4 hover:-translate-y-1 transition-all duration-300 border-t-2 border-t-emerald-500/50">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">HungryHub</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-black tracking-widest uppercase">Food Delivery Platform</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Supported multi-role customer/merchant workflows with ACID transactions, JWT/RBAC security, and optimized eager-loading queries.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-transparent">ASP.NET MVC</span>
              <span className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-transparent">EF Core</span>
            </div>
          </div>

          {/* Trip Unite */}
          <div className="glass-card p-6 rounded-3xl space-y-4 hover:-translate-y-1 transition-all duration-300 border-t-2 border-t-rose-500/50">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Trip Unite</h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-black tracking-widest uppercase">Travel Website</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Teammate-finding portal designed with a highly responsive mobile-first UI using Context API state management.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-transparent">React.js</span>
              <span className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-transparent">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TASKFLOW PRO ARCHITECTURE SECTION */}
      <section className="relative mt-20 pt-16 border-t border-slate-200 dark:border-slate-800/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
        
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase mb-2">
            <Orbit className="w-3.5 h-3.5" />
            Engineering Showcase
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">Inside TaskFlow Pro</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg">
            This entire ecosystem—from system design and DB schema to frontend aesthetics and backend logic—was built completely from scratch within one month.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Tech Stack */}
          <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
              <Layers className="text-blue-600 dark:text-blue-500" /> Technology Stack
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 mt-1"><LayoutTemplate className="w-5 h-5" /></div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">Frontend Layer</strong>
                  <span className="text-sm text-slate-600 dark:text-slate-400">React 19, TypeScript, Tailwind CSS, Lucide Icons. Features an intelligent Context-based auth flow and fully custom components.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400 mt-1"><Server className="w-5 h-5" /></div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">Backend Layer</strong>
                  <span className="text-sm text-slate-600 dark:text-slate-400">ASP.NET Core 8 Web API, Entity Framework Core. Structured with clean architecture, strict DTOs, and global exception handling.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 mt-1"><Database className="w-5 h-5" /></div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">Data Layer</strong>
                  <span className="text-sm text-slate-600 dark:text-slate-400">SQL Server with carefully crafted relational schemas mapping Users to Lists, Tasks, and cascading Subtasks.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Key Implementations */}
          <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
              <ShieldAlert className="text-rose-600 dark:text-rose-500" /> Core Engineering
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-rose-100 dark:bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-400 mt-1"><Shield className="w-5 h-5" /></div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">Dual-Layer Security & Anti-DDoS</strong>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Secured via Cloudflare (Layer 1) and native ASP.NET Core Rate Limiting (Layer 2) to mitigate brute-forcing and API abuse.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400 mt-1"><Zap className="w-5 h-5" /></div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">Perceived Performance (Shimmer UI)</strong>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Implemented advanced skeleton loaders (Shimmer effects) to hide network latency, ensuring the app feels instantaneous and fluid.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400 mt-1"><Cpu className="w-5 h-5" /></div>
                <div>
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">Premium UX Engine</strong>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Powered by the Lenis smooth-scrolling engine, glassmorphism UI, hardware-accelerated parallax backgrounds, and micro-interactions.</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* The 1-Month Development Journey Timeline */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800/50">
          <div className="text-center space-y-4 mb-16 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">The 1-Month Sprint</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A detailed breakdown of how this entire ecosystem was engineered from scratch in just 30 days.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-800/50 ml-4 md:ml-8 space-y-12 pb-8">
            
            {/* Phase 1 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-2 border-white dark:border-slate-900" />
              <div className="glass-panel p-6 rounded-2xl hover:border-blue-500/30 transition-colors">
                <span className="text-blue-600 dark:text-blue-400 font-black text-xs tracking-widest uppercase mb-2 block">Phase 1</span>
                <h4 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">System Design & Database Schema</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The project kicked off with comprehensive system design. Before writing any code, the entire Relational Database Schema was architected using Entity Framework Core. I mapped out the complex relationships between Users, Lists, Tasks, and cascading Subtasks, ensuring the foundation was completely solid and normalized for scale.
                </p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] border-2 border-white dark:border-slate-900" />
              <div className="glass-panel p-6 rounded-2xl hover:border-purple-500/30 transition-colors">
                <span className="text-purple-600 dark:text-purple-400 font-black text-xs tracking-widest uppercase mb-2 block">Phase 2</span>
                <h4 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Backend Engineering & Storage</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  With the schema locked in, I built the ASP.NET Core 8 Web API. I implemented strict clean architecture, utilizing Data Transfer Objects (DTOs) for secure data mutation, Global Exception Handling, and stateless JWT Authentication to ensure the server remained incredibly fast and highly secure.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-white dark:border-slate-900" />
              <div className="glass-panel p-6 rounded-2xl hover:border-emerald-500/30 transition-colors">
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs tracking-widest uppercase mb-2 block">Phase 3</span>
                <h4 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Frontend Mastery & UX Engineering</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Moving to the client, I engineered a highly responsive React 19 application. To mask any API network latency, I custom-built advanced Shimmer UI skeleton loaders so the app feels completely instantaneous. The entire state management flow was built using the native Context API for maximum performance.
                </p>
              </div>
            </div>

            {/* Phase 4 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] border-2 border-white dark:border-slate-900" />
              <div className="glass-panel p-6 rounded-2xl hover:border-rose-500/30 transition-colors">
                <span className="text-rose-600 dark:text-rose-400 font-black text-xs tracking-widest uppercase mb-2 block">Phase 4</span>
                <h4 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">Security, Polish & Micro-Interactions</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The final week was dedicated to perfecting the details. I integrated the hardware-accelerated Lenis smooth-scrolling engine and parallax backgrounds to give it a "royal" premium feel. Finally, I hardened the entire infrastructure with Dual-Layer DDoS protection (Cloudflare + native ASP.NET Rate Limiting) to make the platform bulletproof.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
