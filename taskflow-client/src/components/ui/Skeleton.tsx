import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/20 dark:bg-slate-700/30 rounded-xl ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
