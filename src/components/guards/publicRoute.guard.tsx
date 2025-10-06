'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '../ui/loading';
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}
//PUBLIC ROTE WRAPPER THAT WILL BE SHOWN WHEN A USER IS AUTHENTICATED
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
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking && isAuthenticated) {
      const returnUrl = searchParams.get('returnUrl');
      const destination = returnUrl ? decodeURIComponent(returnUrl) : redirectTo;
      router.push(destination);
    }
  }, [isAuthenticated, isChecking, router, searchParams, redirectTo]);

  if (isChecking) {
    return fallback || (
      <GlobalLoading text='checking authentication' />
    );
  }

  if (isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}