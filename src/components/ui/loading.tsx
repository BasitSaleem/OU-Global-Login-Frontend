import { cn } from '@/utils/helpers';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  bg?: boolean
  fullScreen?: boolean;
  className?: string;
}

export function Loading({
  size = 'md',
  text,
  fullScreen = false,
  className
}: LoadingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      className
    )}>
      <Loader2 className={cn('animate-spin text-blue-600 dark:text-blue-400', sizes[size])} />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        {content}
      </div>
    );
  }

  return content;
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-skeleton ',
        className
      )}
    />
  );
}

export function LoadingSpinner({ size = 5, className }: { size?: number, className?: string }) {
  return (
    <div className="text-center flex flex-col items-center">
      <div className={cn(`animate-spin rounded-full h-${size} w-${size} border-b-2 border-[#795CF5] mx-auto`, className)}></div>
    </div >
  );
}


export function GlobalLoading({
  text = "Loading...",
  className
}: LoadingProps) {
  return (
    <div
      className={cn(
        `fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-background"} `,
        className
      )}
    >
      <div className="text-center">
        <div
          className=
          "animate-spin rounded-full h-28 w-28 border-b-2 border-[#795CF5] mx-auto" />
        {text && (
          <p className="mt-4  text-sm font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
