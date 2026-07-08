import React from 'react';
import { Skeleton } from './Skeleton';

export const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 group relative overflow-hidden h-[120px]">
      <div className="flex items-start gap-3">
        {/* Checkbox Skeleton */}
        <Skeleton className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title Skeleton */}
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          
          {/* Description/Tags Skeleton */}
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
        </div>

        {/* Action Button Skeleton */}
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      </div>
    </div>
  );
};

export default TaskCardSkeleton;
