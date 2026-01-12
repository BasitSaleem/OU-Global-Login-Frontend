'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';
import { useAppDispatch } from '@/redux/store';
import { setOrganization } from '@/redux/slices/auth.slice';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const dispatch = useAppDispatch()
  const router = useRouter();
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
    if (!isLoading && isError && !data?.data?.user) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isError, data, router]);

  if (isLoading) {
    return fallback || null;
  }

  if (isError && !data?.data?.user) {
    return fallback || null;
  }

  return <>{children}</>;
}

