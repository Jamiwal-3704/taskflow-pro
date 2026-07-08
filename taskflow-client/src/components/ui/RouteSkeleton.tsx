import React from 'react';
import { Skeleton } from './Skeleton';
import { TaskCardSkeleton } from './TaskCardSkeleton';

export const RouteSkeleton: React.FC = () => {
  return (
    <div className="flex-1 w-full h-full animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Skeleton */}
          <div>
            <Skeleton className="h-8 w-48 rounded-lg mb-2" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>

          {/* Quick Add Skeleton */}
          <div className="flex gap-3 max-w-xl">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>

          {/* Tasks Grid Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar/Widgets) */}
        <div className="space-y-6 lg:mt-0 mt-8">
          {/* Widget Skeleton */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-5/6 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteSkeleton;
