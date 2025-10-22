'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/helpers';
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setIsAnimating(true);
    setTheme(isDark ? 'light' : 'dark');
    setTimeout(() => setIsAnimating(false), 400);
  };

  if (!mounted) {
    return (
      <div className="w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  const isDark = (theme ?? resolvedTheme) === 'dark';

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative mb-5 transition-all duration-500 ease-in-out cursor-pointer",
        "bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900",
        "shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-3 focus:ring-blue-500/50",
        "border border-white/10",
        isAnimating && "scale-110"
      )}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {/* Day/Night background transition */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-500",
          isDark ? "opacity-0 scale-0" : "opacity-100 scale-100"
        )}
      />

      {/* Stars for night mode */}
      <div className={cn(
        "absolute inset-0 rounded-full transition-opacity duration-500",
        isDark ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute top-2 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
        <div className="absolute bottom-3 right-5 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-100" />
      </div>

      {/* Thumb with icons */}
      <div
        className={cn(
          "absolute top-1 w-6 h-6 rounded-full bg-white shadow-2xl transition-all duration-500 ease-out",
          "flex items-center justify-center transform",
          isDark 
            ? "translate-x-7 rotate-360" 
            : "translate-x-1 rotate-0"
        )}
      >
        <div className="relative w-3 h-3">
          <Sun
            className={cn(
              "absolute w-3 h-3 text-yellow-500 transition-all duration-400",
              isDark 
                ? "opacity-0 scale-0 rotate-180" 
                : "opacity-100 scale-100 rotate-0"
            )}
          />
          <Moon
            className={cn(
              "absolute w-3 h-3 text-gray-700 transition-all duration-400",
              isDark 
                ? "opacity-100 scale-100 rotate-0" 
                : "opacity-0 scale-0 rotate-180"
            )}
          />
        </div>
      </div>

      {/* Active glow */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-white/40 animate-ping duration-400" />
      )}
    </button>
  );
}