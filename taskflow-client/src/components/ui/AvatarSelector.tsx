import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AVATAR_SEEDS = [
  'Felix', 'Aneka', 'Jocelyn', 'Robert', 'Jack', 'Mia', 
  'Oliver', 'Sophia', 'Leo', 'Zoe', 'Lucas', 'Mila'
];

export const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=e2e8f0,cbd5e1,f1f5f9`;

interface AvatarSelectorProps {
  selectedUrl: string | null;
  onSelect: (url: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedUrl, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Drag to scroll refs
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    if (scrollRef.current) {
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft.current = scrollRef.current.scrollLeft;
      scrollRef.current.style.cursor = 'grabbing';
      scrollRef.current.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Choose an Avatar Sticker
        </label>
        <div className="flex items-center gap-1">
          <button 
            type="button" 
            onClick={() => scroll('left')}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            onClick={() => scroll('right')}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar cursor-grab active:cursor-grabbing"
        style={{
          msOverflowStyle: 'none',  
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth'
        }}
      >
        {AVATAR_SEEDS.map((seed) => {
          const url = getAvatarUrl(seed);
          const isSelected = selectedUrl === url;
          
          return (
            <div 
              key={seed}
              onClick={() => {
                if (!isDragging.current) onSelect(url);
              }}
              className={`shrink-0 cursor-pointer transition-all duration-300 relative group
                ${isSelected ? 'scale-110 opacity-100' : 'scale-100 opacity-60 hover:opacity-100'}
              `}
            >
              <div 
                className={`w-20 h-20 rounded-2xl overflow-hidden p-1 transition-all duration-300 pointer-events-none ${
                  isSelected 
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900' 
                    : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                }`}
              >
                <img 
                  src={url} 
                  alt={`${seed} avatar`} 
                  className="w-full h-full object-cover rounded-xl bg-white"
                  loading="lazy"
                />
              </div>
              
              {isSelected && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1 shadow-sm animate-in zoom-in">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AvatarSelector;
