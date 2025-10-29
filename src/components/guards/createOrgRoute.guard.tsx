'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { ROUTES } from '@/constants';
import { GlobalLoading } from '../ui/loading';

interface CreateOrganizationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function CreateOrganizationGuard({
  children,
  fallback,
  redirectTo = ROUTES.DASHBOARD,
  requireAuth = true,
}: CreateOrganizationGuardProps) {
  const router = useRouter();
  const { user, organization } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth || !user) {
      setIsLoading(false);
      return;
    }
    if (organization) {
      setIsLoading(false)
      router.replace(ROUTES.DASHBOARD)
    } else if (!organization) {
      setIsLoading(false);
      router.replace("create-organization")
    }
    setIsLoading(false)
  }, [user, organization, requireAuth, router, redirectTo]);
  if (isLoading) {
    return fallback || <GlobalLoading text="Checking organization..." />;
  }

  return <>{children}</>;


  return null;
}
