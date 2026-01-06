'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';
import { useAppDispatch } from '@/redux/store';
import { setOrganization } from '@/redux/slices/auth.slice';

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
    isError,
    error
  } = useGetMe();
  const organization = data?.data?.user?.organizations?.[0] ?? data?.data?.user?.memberships?.[0]?.organization ?? undefined
  if (organization !== undefined) {
    dispatch(setOrganization(organization))
  }
  if (isLoading) {
    return (
      fallback
    );
  }
  if (!isLoading && isError && !data?.data.user) {
    router.replace(ROUTES.LOGIN)
  }
  else {
    return <>{children}</>;
  }
}
