'use client';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '../ui/loading';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useEffect } from 'react';
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
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth)

  const { data, isLoading, isError } = useGetMe({ enabled: isAuthenticated })
  console.log(isAuthenticated, "this is authenticated")
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    } else if (!isLoading && !isError && data?.data?.user) {
      dispatch(setAuth({
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        organization: data.data.user.organizations?.[0] ?? data.data.user.memberships?.[0]?.organization ?? null,
        refreshToken: null
      }));
      router.replace(redirectTo);
    }
  }, [isAuthenticated, data, isLoading, isError, redirectTo, router, dispatch]);

  if (isAuthenticated || isLoading || (!isError && data?.data?.user)) {
    return fallback || (
      <GlobalLoading text='Redirecting' />
    );
  }



  return <>{children}</>;
}