import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { DynamicGridBackground } from '../../components/ui/DynamicGridBackground';
import { GlassFilter } from '../../components/ui/liquid-glass';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent relative">
          {/* Overlay to close sidebar on mobile click */}
          {isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-xs"
            />
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
