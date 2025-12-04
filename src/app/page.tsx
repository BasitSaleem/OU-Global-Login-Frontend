'use client';
import { Suspense } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import HomePage from '@/components/pages/Homepage/home-page';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthGuard } from '@/components/HOCs/auth-guard';
import { GlobalLoading } from '@/components/ui/loading';
import { CreateOrganizationGuard } from '@/components/HOCs/createOrgRoute.guard';

export default function Page() {
  return (
    <ErrorBoundary>
      <AuthGuard fallback={<GlobalLoading text='loading in the auth guard .....' />}>
        <DashboardLayout>
          <CreateOrganizationGuard>
            <Suspense fallback={<GlobalLoading />}>
              <HomePage />
            </Suspense>
          </CreateOrganizationGuard>
        </DashboardLayout>
      </AuthGuard>
    </ErrorBoundary>
  );
}
