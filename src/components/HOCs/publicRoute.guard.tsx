'use client';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '../ui/loading';
import { useAppSelector } from '@/redux/store';
import { useEffect } from 'react';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

// PUBLIC ROUTE WRAPPER - Redirects authenticated users away from public pages (like login)
export function PublicRoute({
  children,
  redirectTo = ROUTES.HOME,
  fallback
}: PublicRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  if (isAuthenticated) {
    return fallback || (
      <GlobalLoading text='Redirecting' />
    );
  }

  return <>{children}</>;
}