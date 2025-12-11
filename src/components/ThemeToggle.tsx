'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/helpers';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // compute current mode every render
  const isDark = (theme ?? resolvedTheme) === 'dark';

  const handleToggle = () => {
    setIsAnimating(true);
    setTheme(isDark ? 'light' : 'dark');
    setTimeout(() => setIsAnimating(false), 400);
  };

  if (!mounted) {
    return <div className="w-14 h-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />;
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative h-8 w-14 rounded-full overflow-hidden',
        'transition-all duration-500 ease-in-out',
        'cursor-pointer select-none',
        'bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600',
        'dark:from-gray-700 dark:via-gray-800 dark:to-gray-900',
        'shadow-lg hover:shadow-xl',
        'transform hover:scale-105 active:scale-95',
        // 'focus:outline-none focus-visible:ring ring-[3px] ring-blue-500/50',
        'border border-white/10',
        'flex item-center',
        isAnimating && 'scale-110'
      )}
    >
      {/* day wash */}
      <div
        className={cn(
          'absolute inset-0 rounded-full',
          'bg-gradient-to-r from-yellow-300 to-orange-400',
          'transition-all duration-500',
          isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        )}
      />

      {/* night stars */}
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-opacity duration-500',
          isDark ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="absolute top-2 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
        <div className="absolute bottom-3 right-5 w-0.5 h-0.5 bg-white rounded-full animate-pulse [animation-delay:120ms]" />
      </div>

      {/* thumb */}
      <div
        className={cn(
          'absolute top-1 h-6 w-6 rounded-full bg-white shadow-2xl',
          'transition-all duration-500 ease-out will-change-transform',
          'flex items-center justify-center',
          isDark ? 'translate-x-7 rotate-[360deg]' : 'translate-x-1 rotate-0'
        )}
      >
        <div className="relative h-3 w-3">
          <Sun
            className={cn(
              'absolute h-3 w-3 text-yellow-500 transition-all duration-[400ms]',
              isDark ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'
            )}
          />
          <Moon
            className={cn(
              'absolute h-3 w-3 text-gray-700 transition-all duration-[400ms]',
              isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-180'
            )}
          />
        </div>
      </div>

      {/* active glow */}
      {/* {isAnimating && (
        <div className="pointer-events-none absolute inset-0 rounded-full bg-white/40 animate-ping [animation-duration:400ms]" />
      )} */}
    </button>
  );
}
