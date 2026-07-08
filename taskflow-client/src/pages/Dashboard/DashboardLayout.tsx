import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { DynamicGridBackground } from '../../components/ui/DynamicGridBackground';
import { GlassFilter } from '../../components/ui/liquid-glass';
import RouteSkeleton from '../../components/ui/RouteSkeleton';
import Lenis from 'lenis';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!mainRef.current || !contentRef.current) return;

    // Initialize Lenis for that "royal" smooth scrolling feel
    const lenis = new Lenis({
      wrapper: mainRef.current,
      content: contentRef.current,
      lerp: 0.08, // Adjust for butter smoothness
      wheelMultiplier: 0.8, // Slightly slower scroll speed for "royal" feel
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync parallax with the exact smooth scroll position
    lenis.on('scroll', (e: any) => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${e.scroll * 0.4}px)`;
      }
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-transparent text-slate-100 font-sans overflow-hidden relative">
      {/* Dynamic Cursor Grid Background */}
      <DynamicGridBackground />
      
      {/* SVG Liquid Glass distortion filter */}
      <GlassFilter />

      {/* Top Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative bg-transparent">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Content Area */}
        <main 
          ref={mainRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent relative"
        >
          {/* Parallax Decorative Background */}
          <div 
            ref={parallaxRef}
            className="absolute inset-0 pointer-events-none -z-10 overflow-visible"
          >
            <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-blob" />
            <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-blob animation-delay-4000" />
          </div>

          {/* Scrolling Content Wrapper for Lenis */}
          <div ref={contentRef}>
            {/* Overlay to close sidebar on mobile click */}
          {isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-xs"
            />
          )}

          <React.Suspense fallback={<RouteSkeleton />}>
            <Outlet />
          </React.Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
