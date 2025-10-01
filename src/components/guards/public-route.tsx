'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { ROUTES } from '@/constants';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * PublicRoute component for routes that should only be accessible to unauthenticated users
 * (like login, signup, forgot password pages)
 */
export function PublicRoute({ 
  children, 
  redirectTo = ROUTES.HOME,
  fallback
}: PublicRouteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to allow auth initialization to complete
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking && isAuthenticated) {
      // Check if there's a return URL to redirect back to
      const returnUrl = searchParams.get('returnUrl');
      const destination = returnUrl ? decodeURIComponent(returnUrl) : redirectTo;
      
      router.push(destination);
    }
  }, [isAuthenticated, isChecking, router, searchParams, redirectTo]);

  // Show loading state while checking authentication
  if (isChecking) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#795CF5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting authenticated users
  if (isAuthenticated) {
    return null;
  }

  // Render children for unauthenticated users
  return <>{children}</>;
}