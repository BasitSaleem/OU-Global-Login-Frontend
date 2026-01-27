'use client';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { useAppSelector } from '@/redux/store';
import { useEffect } from 'react';
import { Loader } from '../ui';

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
      console.log("isAuthenticated");
      console.log(redirectTo, "redirectTo");
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  if (isAuthenticated) {
    return fallback || (
      <Loader text='Redirecting' />
    );
  }

  return <>{children}</>;
}