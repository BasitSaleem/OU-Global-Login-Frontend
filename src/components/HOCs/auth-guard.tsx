'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';
import { useAppDispatch } from '@/redux/store';
import { clearAuth, setOrganization } from '@/redux/slices/auth.slice';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasRedirected = useRef(false);

  const {
    data,
    isLoading,
    isError
  } = useGetMe();

  useEffect(() => {
    if (!isLoading && data?.data?.user) {
      const organization = data.data.user.organizations?.[0] ?? data.data.user.memberships?.[0]?.organization ?? undefined;
      if (organization) {
        dispatch(setOrganization(organization));
      }
    }
  }, [data, isLoading, dispatch]);

  useEffect(() => {
    if (!isLoading && isError && !hasRedirected.current) {
      hasRedirected.current = true;
      dispatch(clearAuth());
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isError, router, dispatch, queryClient]);

  if (isLoading) {
    return fallback || null;
  }

  if (isError) {
    return fallback || null;
  }

  return <>{children}</>;
}

