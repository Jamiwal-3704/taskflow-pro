import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, HelpCircle, LogOut, Settings } from 'lucide-react';
import axiosInstance from '../../api/axios';
import ENDPOINTS from '../../api/endpoints';
import type { TodoTask } from '../../types/task';
import ProfileModal from './ProfileModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TodoTask[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await axiosInstance.get(ENDPOINTS.TASKS.SEARCH(searchQuery));
          setSearchResults(response.data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        setSearchQuery('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchResultClick = (listId: string) => {
    setSearchResults([]);
    setSearchQuery('');
    navigate(`/dashboard/lists/${listId}`);
  };

  const getAvatarLetter = () =>
    user?.displayName ? user.displayName.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 shrink-0 z-20 relative select-none theme-bg-transition glass-panel"
      style={{
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: 0,
      }}
    >
      {/* Left: Hamburger + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl md:hidden cursor-pointer transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--hover-bg)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => navigate('/dashboard')}
          className="cursor-pointer"
        >
          <span
            className="font-black text-lg tracking-tight select-none"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #818cf8 60%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            TaskFlow Pro
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div ref={searchRef} className="hidden md:flex flex-col max-w-sm w-full relative">
        <div className="relative w-full">
          <Search
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search tasks (e.g. Back Day, Gym list)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none glass-input"
          />
        </div>

        {/* Search Results Dropdown */}
        {(searchQuery.length >= 2 && (isSearching || searchResults.length > 0 || searchQuery.trim() !== '')) && (
          <div className="absolute top-full mt-2 w-full glass-panel rounded-xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
            {isSearching ? (
              <div className="px-4 py-3 text-xs text-slate-500 text-center animate-pulse">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="flex flex-col">
                <div className="px-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/10 dark:border-slate-800 mb-1">
                  Task Results
                </div>
                {searchResults.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleSearchResultClick(task.listId)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-500/10 transition-colors flex flex-col gap-1 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{task.title}</span>
                    <span className="text-[10px] text-slate-500 truncate">{task.description || 'No description'}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-xs text-slate-500 text-center">No matching tasks found.</div>
            )}
          </div>
        )}
      </div>

      {/* Right: User Profile */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/guide')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--hover-bg)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          }}
        >
          <HelpCircle className="w-4 h-4" />
          <span>User Guide</span>
        </button>

        {/* Profile section */}
        <div
          className="flex items-center gap-3 pl-3"
          style={{ borderLeft: '1px solid var(--glass-border)' }}
        >
          <div className="hidden sm:flex flex-col text-right select-none">
            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              {user?.displayName}
            </span>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
              {user?.usageType === 1 ? 'Business' : 'Personal'}
            </span>
          </div>

          {/* Avatar with dropdown */}
          <div className="relative group">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer select-none glass-panel"
              style={{ border: '1px solid var(--glass-border)' }}
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-sm font-black text-blue-500">
                  {getAvatarLetter()}
                </span>
              )}
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 top-full pt-2 w-44 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div className="glass-panel rounded-xl shadow-2xl py-1 transform translate-y-1 group-hover:translate-y-0">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="w-full px-4 py-2.5 text-xs font-medium text-left cursor-pointer flex items-center gap-2 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--hover-bg)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                >
                  <Settings className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  Profile Settings
                </button>
                <button
                  onClick={() => navigate('/dashboard/guide')}
                  className="w-full px-4 py-2.5 text-xs font-medium text-left cursor-pointer flex items-center gap-2 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--hover-bg)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                >
                  <HelpCircle className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  Tour Guide
                </button>
                <div style={{ borderTop: '1px solid var(--glass-border)', margin: '4px 0' }} />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-xs font-bold text-left cursor-pointer flex items-center gap-2 transition-colors text-rose-500 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
