import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import NewListModal from '../lists/NewListModal';
import type { TodoList } from '../../types/list';
import { Sun, Moon, Plus, List } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import LiveClock from './LiveClock';

interface SidebarProps {
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [lists, setLists] = useState<TodoList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLists = async () => {
    try {
      const response = await api.get<TodoList[]>(ENDPOINTS.LISTS.BASE);
      setLists(response.data);
    } catch (error) {
      console.error('Failed to load lists in sidebar:', error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateListSuccess = (newList: TodoList) => {
    setLists((prev) => [...prev, newList]);
    navigate(`/dashboard/list/${newList.id}`);
  };

  const navItems = [
    { name: "Today's Focus", path: '/dashboard/today', icon: '📅' },
    { name: 'Day Planner', path: '/dashboard/daywise', icon: '🗓️' },
    { name: 'Important', path: '/dashboard/important', icon: '⭐' },
    { name: 'Tour Guide', path: '/dashboard/guide', icon: '💡' },
  ];

  const isRouteActive = (path: string) => location.pathname === path;

  const isDark = theme === 'dark';

  return (
    <>
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 shrink-0 transition-transform duration-300 ease-in-out z-30 flex flex-col justify-between glass-panel border-y-0 border-l-0 border-r theme-bg-transition`}
        style={{
          borderRight: '1px solid var(--glass-border)',
        }}
      >
        <div className="space-y-5 flex-1 overflow-y-auto p-4 pr-3">
          {/* Main Navigation */}
          <nav className="space-y-1">
            <div
              className="text-[10px] font-black uppercase tracking-widest px-3 mb-3 select-none"
              style={{ color: 'var(--text-muted)' }}
            >
              Workspace Views
            </div>

            {navItems.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full glass-nav-item ${active ? 'active' : ''} flex items-center gap-3 px-3.5 py-2.5 text-xs cursor-pointer select-none`}
                >
                  <span className="text-sm shrink-0 select-none">{item.icon}</span>
                  <span className="font-semibold">{item.name}</span>
                  {active && (
                    <span className="ml-auto w-1 h-4 rounded-full bg-blue-500 opacity-75 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Custom Lists */}
          <div className="space-y-2">
            <div
              className="flex items-center justify-between px-3 text-[10px] font-black uppercase tracking-widest select-none mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <span>My Lists</span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-blue-500 hover:text-blue-400 font-black hover:scale-110 transition-transform cursor-pointer flex items-center gap-0.5 text-[10px]"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>

            <div className="space-y-1">
              {lists.map((list) => {
                const listPath = `/dashboard/list/${list.id}`;
                const isActive = isRouteActive(listPath);
                return (
                  <button
                    key={list.id}
                    onClick={() => navigate(listPath)}
                    className={`w-full glass-nav-item ${isActive ? 'active' : ''} flex items-center justify-between px-3.5 py-2.5 text-xs cursor-pointer select-none`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        style={{ backgroundColor: list.colorHex || '#3B82F6' }}
                        className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                      />
                      <span className="truncate font-medium">{list.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-[10px]">
                      {list.listType === 1 && <span title="Tracker">🏋️</span>}
                      {list.isCollaborative && <span title="Collaborative">👥</span>}
                    </div>
                  </button>
                );
              })}

              {lists.length === 0 && (
                <div
                  className="text-[11px] italic px-3 py-1.5 select-none"
                  style={{ color: 'var(--text-muted)' }}
                >
                  No custom lists yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 pt-0 space-y-3">
          {/* Create New List Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200"
            style={{
              color: 'var(--text-secondary)',
              border: '1px dashed var(--glass-border)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(59,130,246,0.4)';
              (e.currentTarget as HTMLButtonElement).style.color = '#3b82f6';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--glass-border)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <List className="w-3.5 h-3.5" />
            <span>Create New List</span>
          </button>

          {/* Dark / Light Mode Toggle Pill */}
          <div
            className="flex items-center p-1 rounded-2xl relative select-none"
            style={{
              background: isDark ? 'rgba(2, 6, 23, 0.6)' : 'rgba(226, 232, 240, 0.6)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'inset 0 1px 0 var(--glass-highlight)',
            }}
          >
            {/* Sliding pill indicator */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 ease-in-out"
              style={{
                left: isDark ? 'calc(50% + 2px)' : '4px',
                background: isDark
                  ? 'rgba(30, 41, 59, 0.9)'
                  : 'rgba(255, 255, 255, 0.95)',
                boxShadow: isDark
                  ? '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)'
                  : '0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}
            />

            {/* Light Button */}
            <button
              onClick={() => theme !== 'light' && toggleTheme()}
              className="relative z-10 flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors duration-300 cursor-pointer"
              style={{
                color: !isDark ? '#2563eb' : 'var(--text-muted)',
              }}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>

            {/* Dark Button */}
            <button
              onClick={() => theme !== 'dark' && toggleTheme()}
              className="relative z-10 flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors duration-300 cursor-pointer"
              style={{
                color: isDark ? '#60a5fa' : 'var(--text-muted)',
              }}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>

          {/* Live Clock Component */}
          <LiveClock />
        </div>
      </aside>

      <NewListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateListSuccess}
      />
    </>
  );
};

export default Sidebar;
