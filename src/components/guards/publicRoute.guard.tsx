'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '../ui/loading';
import { setAuth } from '@/redux/slices/auth.slice';
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
const dispatch = useAppDispatch()
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking && isAuthenticated) {
      console.log('redirectTo inside: ', redirectTo);

      const destination = redirectTo;

      console.log('Destination: ', destination);
      
      router.replace(destination);
      
    }
  }, [isAuthenticated, isChecking, router, searchParams, redirectTo]);
  
  if (isChecking) {
    return fallback || (
      <GlobalLoading text='checking authentication...' />
    );
  }

  if (isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}