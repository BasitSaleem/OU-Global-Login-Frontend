'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '../ui/loading';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isChecking, router]);

  if (isChecking) {
    return fallback || (
      <GlobalLoading />
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}