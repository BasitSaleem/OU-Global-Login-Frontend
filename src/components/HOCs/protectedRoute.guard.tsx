'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '../ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = ROUTES.LOGIN,
  requireAuth = true,
  allowedRoles = []
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking) {
      if (requireAuth && !isAuthenticated) {
        const returnUrl = pathname !== ROUTES.LOGIN ? `?returnUrl=${encodeURIComponent(pathname)}` : '';
        router.push(`${redirectTo}${returnUrl}`);
        return;
      }

      if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
        const userRole = user?.role?.name || user?.role_id;
        if (userRole && !allowedRoles.includes(userRole)) {
          router.push(ROUTES.DASHBOARD || '/');
          return;
        }
      }
    }
  }, [isAuthenticated, isChecking, router, pathname, redirectTo, requireAuth, allowedRoles, user]);

  if (isChecking) {
    return fallback || (
      <LoadingSpinner />
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
    const userRole = user?.role?.name || user?.role_id;
    if (userRole && !allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
}