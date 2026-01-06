'use client';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '../ui/loading';
import { useGetMe } from '@/apiHooks.ts/auth/auth.api';
import { useAppSelector } from '@/redux/store';
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
  const { isAuthenticated } = useAppSelector((s) => s.auth)

  const { data, isLoading, isError } = useGetMe({ enabled: isAuthenticated })
  if (isAuthenticated || (!isLoading && !isError && data?.data?.user)) {
    router.replace(redirectTo);
    return fallback || (
      <GlobalLoading text='Redirecting...' />
    );
  }

  if (isLoading) {
    return fallback || (
      <GlobalLoading text='checking in the public guard' />
    );
  }
  return <>{children}</>;
}