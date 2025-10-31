'use client';
import { Suspense } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import HomePage from '@/components/pages/Homepage/home-page';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthGuard } from '@/components/guards/auth-guard';
import { GlobalLoading } from '@/components/ui/loading';
import { CreateOrganizationGuard } from '@/components/guards/createOrgRoute.guard';

export default function Page() {
  return (
    <AuthGuard fallback={<GlobalLoading />}>
      <ErrorBoundary>
        <DashboardLayout>
          <CreateOrganizationGuard>
            <Suspense fallback={<GlobalLoading />}>
              <HomePage />
            </Suspense>
          </CreateOrganizationGuard>
        </DashboardLayout>
      </ErrorBoundary>
    </AuthGuard>
  );
}
