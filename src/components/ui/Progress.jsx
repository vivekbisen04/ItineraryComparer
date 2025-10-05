import React from 'react';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  <div ref={ref} className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-200', className)} {...props}>
    <div
      className="h-full bg-primary transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
));

Progress.displayName = 'Progress';

export { Progress };
