'use client';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathName = usePathname();
  const isAllowedPath = [
    "/accept-email-change",
    "/verify-change-email-otp",
    "/decline-email-change",
    redirectTo,
    ROUTES.HOME,
    ROUTES.DASHBOARD
  ].includes(pathName);

  useEffect(() => {
    if (isAuthenticated && !isAllowedPath) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router, isAllowedPath]);

  if (isAuthenticated && !isAllowedPath) {
    return fallback || (
      <Loader text='Redirecting' />
    );
  }

  return <>{children}</>;
}